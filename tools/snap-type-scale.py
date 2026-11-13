#!/usr/bin/env python3
"""Snap every font-size in the site's source stylesheets to the 8-step type scale.

The scale tokens (--t1 … --t8) are defined once on :root in styles.src.css:

    t1 display 80→44 · t2 heading 52→34 · t3 title 34→24 · t4 subtitle 24→19
    t5 body 19→17   · t6 ui 15        · t7 label 13     · t8 fine 12 (the floor)

Each literal size is mapped by its largest (desktop) value; a clamp() whose minimum
is 38px or more is display type and maps to t1. Values already using var(), em/rem,
percentages, inherit or 0 are left alone. Running the script twice is a no-op.

Usage:  python3 tools/snap-type-scale.py styles.src.css science.css legal-pages.src.css
Then rebuild the minified outputs (see README, "CSS workflow").
"""
import re
import sys

STEPS = [  # (upper bound in px, token)
    (12.5, "--t8"),
    (13.5, "--t7"),
    (16, "--t6"),
    (21, "--t5"),
    (28, "--t4"),
    (40, "--t3"),
    (64, "--t2"),
    (float("inf"), "--t1"),
]
DECL = re.compile(r"(font-size\s*:\s*)([^;}!]+?)(\s*(?:!important)?\s*[;}])")
PX = re.compile(r"(\d+(?:\.\d+)?)px")


def token_for(value: str):
    v = value.strip()
    if v.startswith("clamp("):
        nums = [float(n) for n in PX.findall(v)]
        if len(nums) < 2:
            return None
        if nums[0] >= 38:
            return "--t1"
        size = nums[-1]
    else:
        m = re.fullmatch(r"(\d+(?:\.\d+)?)px", v)
        if not m:
            return None
        size = float(m.group(1))
    for bound, token in STEPS:
        if size <= bound:
            return token
    return None


def snap(css: str):
    changed = 0

    def repl(m):
        nonlocal changed
        token = token_for(m.group(2))
        if not token:
            return m.group(0)
        changed += 1
        return f"{m.group(1)}var({token}){m.group(3)}"

    return DECL.sub(repl, css), changed


if __name__ == "__main__":
    for path in sys.argv[1:]:
        with open(path, encoding="utf-8") as f:
            src = f.read()
        out, n = snap(src)
        with open(path, "w", encoding="utf-8") as f:
            f.write(out)
        print(f"{path}: {n} font-size declarations snapped")
