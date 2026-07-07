"""
Fetch O*NET Interest Profiler questions and cache them locally.

Usage:
  $env:ONET_API_KEY = "<your_key>"
  python fetch_onet_questions.py --out data/onet_interest_profiler_questions.json

Do this from backend/admin tooling only. Do not expose the API key in frontend JS.
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.request
from pathlib import Path


API_URL = "https://api-v2.onetcenter.org/mnm/interestprofiler/questions?start=1&end=60"


def fetch_questions(api_key: str) -> dict:
    request = urllib.request.Request(API_URL, headers={"X-API-Key": api_key})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def write_question_map(payload: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        f.write("question_id,dimension\n")
        for question in payload["question"]:
            dimension = question["area"][0].upper()
            f.write(f"{question['index']},{dimension}\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch and cache O*NET Interest Profiler questions.")
    parser.add_argument("--out", default="data/onet_interest_profiler_questions.json")
    parser.add_argument("--question-map-out", default="data/question_map_onet.csv")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    api_key = os.environ.get("ONET_API_KEY")
    if not api_key:
        raise SystemExit("Missing ONET_API_KEY environment variable")

    payload = fetch_questions(api_key)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    write_question_map(payload, Path(args.question_map_out))

    print(f"Wrote {len(payload['question'])} questions to {out_path}")
    print(f"Wrote question map to {args.question_map_out}")


if __name__ == "__main__":
    main()
