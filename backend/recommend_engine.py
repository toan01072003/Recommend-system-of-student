"""
RIASEC/Holland career recommendation engine.

Input:
  - student answers for an interest assessment, scored 1..5
  - a question map: question_id -> R/I/A/S/E/C
  - occupation vectors in the same R/I/A/S/E/C space

Output:
  - top N ranked careers by cosine similarity

This module also includes an O*NET loader for:
  - Career Interest Types.txt in O*NET 30.3
  - Interests.txt in older O*NET releases
  - Occupation Data.txt
"""

from __future__ import annotations

import argparse
import csv
import json
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


RIASEC_ORDER = ["R", "I", "A", "S", "E", "C"]
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ONET_TO_SHORT = {
    "Realistic": "R",
    "Investigative": "I",
    "Artistic": "A",
    "Social": "S",
    "Enterprising": "E",
    "Conventional": "C",
}


@dataclass(frozen=True)
class CareerVector:
    soc_code: str
    title: str
    vector: list[float]


@dataclass(frozen=True)
class RankedCareer:
    rank: int
    soc_code: str
    title: str
    score: float
    vector: list[float]


def cosine_similarity(left: Iterable[float], right: Iterable[float]) -> float:
    a = list(left)
    b = list(right)
    if len(a) != len(b):
        raise ValueError(f"Vector lengths differ: {len(a)} vs {len(b)}")

    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def load_question_map(path: str | Path) -> dict[int, str]:
    question_map: dict[int, str] = {}
    with Path(path).open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        required = {"question_id", "dimension"}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError(f"{path} must contain columns: {sorted(required)}")

        for row in reader:
            question_id = int(row["question_id"])
            dimension = row["dimension"].strip().upper()
            if dimension not in RIASEC_ORDER:
                raise ValueError(f"Invalid RIASEC dimension for question {question_id}: {dimension}")
            question_map[question_id] = dimension

    return question_map


def load_answers(path: str | Path) -> dict[int, int]:
    with Path(path).open("r", encoding="utf-8") as f:
        raw = json.load(f)

    if isinstance(raw, dict) and "answers" in raw:
        raw = raw["answers"]

    if isinstance(raw, list):
        return {idx + 1: int(value) for idx, value in enumerate(raw)}

    if isinstance(raw, dict):
        return {int(key): int(value) for key, value in raw.items()}

    raise ValueError("answers JSON must be a list, a {question_id: score} object, or {answers: ...}")


def score_student_answers(answers: dict[int, int], question_map: dict[int, str]) -> list[float]:
    missing = sorted(set(question_map) - set(answers))
    extra = sorted(set(answers) - set(question_map))
    if missing:
        raise ValueError(f"Missing answers for question_id: {missing[:10]}")
    if extra:
        raise ValueError(f"Answers include unknown question_id: {extra[:10]}")

    totals = {dimension: 0.0 for dimension in RIASEC_ORDER}
    for question_id, score in answers.items():
        if score < 1 or score > 5:
            raise ValueError(f"Answer score must be 1..5 for question {question_id}, got {score}")
        totals[question_map[question_id]] += float(score)

    return [totals[dimension] for dimension in RIASEC_ORDER]


def load_career_vectors(path: str | Path) -> list[CareerVector]:
    careers: list[CareerVector] = []
    with Path(path).open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        required = {"soc_code", "title", *RIASEC_ORDER}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError(f"{path} must contain columns: {sorted(required)}")

        for row in reader:
            careers.append(
                CareerVector(
                    soc_code=row["soc_code"],
                    title=row["title"],
                    vector=[float(row[dimension]) for dimension in RIASEC_ORDER],
                )
            )
    return careers


def rank_careers(student_vector: list[float], careers: list[CareerVector], top_n: int = 10) -> list[RankedCareer]:
    ranked = [
        RankedCareer(
            rank=0,
            soc_code=career.soc_code,
            title=career.title,
            score=cosine_similarity(student_vector, career.vector),
            vector=career.vector,
        )
        for career in careers
    ]
    ranked.sort(key=lambda item: item.score, reverse=True)
    return [
        RankedCareer(
            rank=idx,
            soc_code=item.soc_code,
            title=item.title,
            score=item.score,
            vector=item.vector,
        )
        for idx, item in enumerate(ranked[:top_n], start=1)
    ]


def build_vectors_from_onet(interests_path: str | Path, occupation_data_path: str | Path) -> list[CareerVector]:
    titles: dict[str, str] = {}
    with Path(occupation_data_path).open("r", encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f, delimiter="\t"):
            titles[row["O*NET-SOC Code"]] = row["Title"]

    grouped: dict[str, dict[str, float]] = {}
    with Path(interests_path).open("r", encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f, delimiter="\t"):
            if row["Scale ID"] != "OI":
                continue

            dimension = ONET_TO_SHORT.get(row["Element Name"])
            if dimension is None:
                continue

            soc_code = row["O*NET-SOC Code"]
            grouped.setdefault(soc_code, {})[dimension] = float(row["Data Value"])

    careers: list[CareerVector] = []
    for soc_code, values in sorted(grouped.items()):
        missing = [dimension for dimension in RIASEC_ORDER if dimension not in values]
        if missing:
            continue
        careers.append(
            CareerVector(
                soc_code=soc_code,
                title=titles.get(soc_code, ""),
                vector=[values[dimension] for dimension in RIASEC_ORDER],
            )
        )
    return careers


def write_career_vectors(careers: list[CareerVector], path: str | Path) -> None:
    out_path = Path(path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["soc_code", "title", *RIASEC_ORDER])
        for career in careers:
            writer.writerow([career.soc_code, career.title, *career.vector])


def print_ranked(ranked: list[RankedCareer], student_vector: list[float]) -> None:
    print("student_vector =", dict(zip(RIASEC_ORDER, student_vector)))
    print()
    print("rank,soc_code,title,score,R,I,A,S,E,C")
    for item in ranked:
        values = ",".join(f"{value:g}" for value in item.vector)
        print(f'{item.rank},{item.soc_code},"{item.title}",{item.score:.4f},{values}')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Rank careers from student RIASEC/Holland answers.")
    parser.add_argument("--answers", help="JSON answers file. Accepts [1..5] list or {question_id: score}.")
    parser.add_argument("--question-map", default=PROJECT_ROOT / "data" / "question_map_template.csv")
    parser.add_argument("--career-vectors", default=PROJECT_ROOT / "data" / "career_vectors_sample.csv")
    parser.add_argument("--top", type=int, default=10)
    parser.add_argument("--build-onet", action="store_true", help="Build career vector CSV from O*NET files.")
    parser.add_argument("--interests", help="Path to O*NET Career Interest Types.txt, or older Interests.txt")
    parser.add_argument("--occupation-data", help="Path to O*NET Occupation Data.txt")
    parser.add_argument("--out", default=PROJECT_ROOT / "data" / "career_vectors_onet.csv")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.build_onet:
        if not args.interests or not args.occupation_data:
            raise SystemExit("--build-onet requires --interests and --occupation-data")
        careers = build_vectors_from_onet(args.interests, args.occupation_data)
        write_career_vectors(careers, args.out)
        print(f"Wrote {len(careers)} career vectors to {args.out}")
        return

    if not args.answers:
        raise SystemExit("Missing --answers. Try: --answers data/student_answers_example.json")

    answers = load_answers(args.answers)
    question_map = load_question_map(args.question_map)
    careers = load_career_vectors(args.career_vectors)
    student_vector = score_student_answers(answers, question_map)
    ranked = rank_careers(student_vector, careers, top_n=args.top)
    print_ranked(ranked, student_vector)


if __name__ == "__main__":
    main()
