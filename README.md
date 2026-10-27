# Collatz Sequence

Browser demo: generate the 3n + 1 sequence from any starting number, see a line chart of values, and play through the steps.

## Run the web app

```powershell
Set-Location "c:\Users\emmak\Desktop\Content\CodingProjects\PortProjects\demos\collatz-sequence\web"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 3017
```

Open http://localhost:3017

## Run the terminal reference

```powershell
Set-Location "c:\Users\emmak\Desktop\Content\CodingProjects\PortProjects\demos\collatz-sequence"
python reference\collatz.py
```

Book provenance and steps: [`BOOK_DIRECTIONS.md`](./BOOK_DIRECTIONS.md).
