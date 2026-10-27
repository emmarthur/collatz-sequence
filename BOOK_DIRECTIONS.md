# Book directions — Collatz Sequence

**Catalog #449** · Al Sweigart, *The Big Book of Small Python Projects* — **Collatz Sequence**

- Online chapter: [inventwithpython.com/bigbookpython/project49.html](https://inventwithpython.com/bigbookpython/project49.html)
- Upstream: [collatz.py](https://github.com/asweigart/the-big-book-of-small-python-projects/blob/main/collatz.py)
- Local reference: [`reference/collatz.py`](./reference/collatz.py)
- Shared logic: [`collatz_core.py`](./collatz_core.py)

## What the book asks you to build

Prompt for a starting integer greater than zero, then print the Collatz sequence comma-separated: halve when even, apply 3n + 1 when odd, stop at 1. The book pauses briefly (`time.sleep(0.1)`) between printed values.

## Web version (`web/` — FastAPI, port **3017**)

- `GET /` — chart, stats, and step-by-step playback
- `POST /api/sequence` — body `{ "start": n }` returns full sequence plus step count and peak value

Starting numbers are limited to **1–999,999** for responsive display in the browser.
