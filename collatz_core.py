"""
Collatz sequence — shared logic for CLI reference and FastAPI web app.

From a positive integer n: if n is even, next is n // 2; if odd, next is 3*n + 1; stop at 1.
"""

from __future__ import annotations

from typing import Any

MIN_START = 1
MAX_START = 999_999
MAX_SEQUENCE_LENGTH = 8_000


def collatz_sequence(start: int) -> list[int]:
    if not isinstance(start, int):
        raise ValueError("Starting number must be a whole number.")
    if start < MIN_START or start > MAX_START:
        raise ValueError(
            f"Enter a whole number from {MIN_START} to {MAX_START:,}."
        )

    sequence = [start]
    n = start
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        sequence.append(n)
        if len(sequence) > MAX_SEQUENCE_LENGTH:
            raise ValueError(
                "Sequence grew too long to display safely. Try a smaller starting number."
            )
    return sequence


def sequence_stats(sequence: list[int]) -> dict[str, int]:
    peak = max(sequence)
    peak_at = sequence.index(peak)
    return {
        "steps": len(sequence) - 1,
        "peak": peak,
        "peak_at_step": peak_at,
    }


def public_result(start: int, sequence: list[int]) -> dict[str, Any]:
    stats = sequence_stats(sequence)
    return {
        "start": start,
        "sequence": sequence,
        "steps": stats["steps"],
        "peak": stats["peak"],
        "peak_at_step": stats["peak_at_step"],
    }
