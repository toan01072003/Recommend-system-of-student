from __future__ import annotations

import sqlite3
from collections.abc import Callable, Mapping, Sequence
from pathlib import Path
from typing import Any

try:
    from ..db import connect
except ImportError:
    from db import connect


RowMapper = Callable[[sqlite3.Row], dict[str, Any]]


def _quote_identifier(identifier: str) -> str:
    if not identifier.replace("_", "").isalnum():
        raise ValueError(f"Unsafe SQL identifier: {identifier}")
    return f'"{identifier}"'


class SQLiteCrudRepository:
    """Small CRUD helper with explicit table/column whitelists."""

    def __init__(
        self,
        *,
        table: str,
        id_column: str,
        writable_columns: Sequence[str],
        db_path: Path,
        row_mapper: RowMapper | None = None,
    ) -> None:
        self.table = table
        self.id_column = id_column
        self.writable_columns = set(writable_columns)
        self.db_path = db_path
        self.row_mapper = row_mapper or (lambda row: dict(row))

    def list(
        self,
        *,
        filters: Mapping[str, Any] | None = None,
        order_by: Sequence[str] | None = None,
    ) -> list[dict[str, Any]]:
        clauses: list[str] = []
        params: list[Any] = []
        for column, value in (filters or {}).items():
            self._assert_column(column, allow_id=True)
            if value is None:
                continue
            clauses.append(f"{_quote_identifier(column)} = ?")
            params.append(value)

        sql = f"SELECT * FROM {_quote_identifier(self.table)}"
        if clauses:
            sql += f" WHERE {' AND '.join(clauses)}"
        if order_by:
            for column in order_by:
                self._assert_column(column, allow_id=True)
            sql += " ORDER BY " + ", ".join(_quote_identifier(column) for column in order_by)

        with connect(self.db_path) as conn:
            return [self.row_mapper(row) for row in conn.execute(sql, params).fetchall()]

    def get(self, entity_id: Any) -> dict[str, Any] | None:
        with connect(self.db_path) as conn:
            row = conn.execute(
                f"""
                SELECT *
                FROM {_quote_identifier(self.table)}
                WHERE {_quote_identifier(self.id_column)} = ?
                """,
                (entity_id,),
            ).fetchone()
            return self.row_mapper(row) if row else None

    def create(self, values: Mapping[str, Any]) -> dict[str, Any]:
        columns = list(values.keys())
        if not columns:
            raise ValueError("create requires at least one value")
        for column in columns:
            self._assert_column(column, allow_id=True)

        placeholders = ", ".join("?" for _ in columns)
        quoted_columns = ", ".join(_quote_identifier(column) for column in columns)
        with connect(self.db_path) as conn:
            conn.execute(
                f"""
                INSERT INTO {_quote_identifier(self.table)} ({quoted_columns})
                VALUES ({placeholders})
                """,
                [values[column] for column in columns],
            )
            conn.commit()
        created = self.get(values.get(self.id_column))
        if created is None:
            raise LookupError(f"{self.table} was not created")
        return created

    def update(self, entity_id: Any, values: Mapping[str, Any]) -> dict[str, Any]:
        columns = [column for column in values.keys() if column != self.id_column]
        if not columns:
            raise ValueError("update requires at least one writable value")
        for column in columns:
            self._assert_column(column)

        assignments = ", ".join(f"{_quote_identifier(column)} = ?" for column in columns)
        params = [values[column] for column in columns] + [entity_id]
        with connect(self.db_path) as conn:
            cursor = conn.execute(
                f"""
                UPDATE {_quote_identifier(self.table)}
                SET {assignments}
                WHERE {_quote_identifier(self.id_column)} = ?
                """,
                params,
            )
            if cursor.rowcount == 0:
                raise LookupError(f"{self.table} not found: {entity_id}")
            conn.commit()

        updated = self.get(entity_id)
        if updated is None:
            raise LookupError(f"{self.table} not found: {entity_id}")
        return updated

    def delete(self, entity_id: Any) -> bool:
        with connect(self.db_path) as conn:
            cursor = conn.execute(
                f"""
                DELETE FROM {_quote_identifier(self.table)}
                WHERE {_quote_identifier(self.id_column)} = ?
                """,
                (entity_id,),
            )
            conn.commit()
            return cursor.rowcount > 0

    def _assert_column(self, column: str, *, allow_id: bool = False) -> None:
        if column == self.id_column and allow_id:
            return
        if column not in self.writable_columns:
            raise ValueError(f"Column is not writable for {self.table}: {column}")
