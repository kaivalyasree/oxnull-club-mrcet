import os
from PIL import Image

img = Image.open(os.path.join("public", "assets", "0xnull-primary-logo.jpg")).convert("RGB")
w, h = img.size

# Let's inspect x coordinates for wordmark (y between 610 and 695)
col_scores_wm = []
for x in range(w):
    diffs = 0
    count = 0
    for y in range(610, 695):
        p = img.getpixel((x, y))
        # Warm ivory background is roughly (245, 235, 225)
        if p[0] < 220 or p[1] < 210 or p[2] < 200:
            diffs += 1
        count += 1
    col_scores_wm.append(diffs / count)

wm_xs = [x for x, s in enumerate(col_scores_wm) if s > 0.05]
print(f"Wordmark X range: min={min(wm_xs)}, max={max(wm_xs)}")

# Let's inspect the split between '0X' and 'NULL'
# 0X is first, then a space or gap, then NULL
for x in range(min(wm_xs), max(wm_xs), 10):
    print(f"x={x:3d}: {col_scores_wm[x]:.2f} {'#' * int(col_scores_wm[x]*30)}")

# Let's also inspect symbol X range (y between 160 and 580)
col_scores_sym = []
for x in range(w):
    diffs = 0
    count = 0
    for y in range(160, 580):
        p = img.getpixel((x, y))
        if p[0] < 220 or p[1] < 210 or p[2] < 200:
            diffs += 1
        count += 1
    col_scores_sym.append(diffs / count)

sym_xs = [x for x, s in enumerate(col_scores_sym) if s > 0.02]
print(f"Symbol X range: min={min(sym_xs)}, max={max(sym_xs)}")
