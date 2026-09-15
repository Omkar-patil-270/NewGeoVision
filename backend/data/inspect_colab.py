import json
import sys

nb = json.load(open("data/colab_notebook.ipynb", encoding="utf-8"))
cells = nb.get("cells", [])

with open("data/colab_summary.txt", "w", encoding="utf-8") as out:
    out.write(f"Total cells: {len(cells)}\n")
    for i, c in enumerate(cells):
        ctype = c.get("cell_type")
        src = "".join(c.get("source", []))
        header = src.strip().split("\n")[0] if src.strip() else "Empty"
        out.write(f"\n=========================================\n")
        out.write(f"Cell {i} [{ctype}]: {header[:120]}\n")
        out.write(f"=========================================\n")
        out.write(src + "\n")

print("Wrote summary to data/colab_summary.txt")
