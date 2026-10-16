import os
from PIL import Image

src_path = os.path.join("public", "assets", "0xnull-primary-logo.jpg")
img = Image.open(src_path).convert("RGBA")
w, h = img.size

# Function to remove the warm ivory background to produce transparent PNG
def make_transparent(im, bg_color=(242, 233, 226), threshold=18, soft=35):
    data = im.getdata()
    new_data = []
    br, bg_c, bb = bg_color
    for item in data:
        r, g, b, a = item
        # Euclidean distance in RGB space to ivory
        dist = ((r - br)**2 + (g - bg_c)**2 + (b - bb)**2) ** 0.5
        if dist < threshold:
            new_data.append((r, g, b, 0))
        elif dist < threshold + soft:
            # Smooth transition
            alpha_factor = (dist - threshold) / soft
            new_data.append((r, g, b, int(255 * alpha_factor)))
        else:
            new_data.append(item)
    im.putdata(new_data)
    return im

# 1. Clean Logo (Symbol + 0XNULL Wordmark ONLY, absolutely NO taglines)
# In original image, the taglines start below y=715
# We crop x from 0 to 1024, y from 0 to 710, and pad/center it nicely
clean_crop = img.crop((0, 80, 1024, 712))
clean_crop.convert("RGB").save(os.path.join("public", "assets", "0xnull-primary-clean.jpg"), quality=95)

# Also a focused crop of the logo + wordmark with square aspect ratio
focused_logo = img.crop((120, 140, 904, 710))
focused_logo.convert("RGB").save(os.path.join("public", "assets", "0xnull-logo-lockup.jpg"), quality=95)

# 2. Symbol only (y from 145 to 585, x from 220 to 804)
# Center is x=512, y=365
sym_crop = img.crop((210, 140, 814, 585))
sym_crop.convert("RGB").save(os.path.join("public", "assets", "0xnull-symbol.jpg"), quality=95)

# 3. Wordmark only (0XNULL) (y: 605 to 705, x: 155 to 875)
wm_crop = img.crop((155, 605, 875, 705))
wm_crop.convert("RGB").save(os.path.join("public", "assets", "0xnull-wordmark.jpg"), quality=95)

# 4. '0X' part of wordmark (x: 155 to 415)
wm_0x = img.crop((155, 605, 415, 705))
wm_0x.convert("RGB").save(os.path.join("public", "assets", "0xnull-wm-0x.jpg"), quality=95)

# 5. 'NULL' part of wordmark (x: 420 to 875)
wm_null = img.crop((420, 605, 875, 705))
wm_null.convert("RGB").save(os.path.join("public", "assets", "0xnull-wm-null.jpg"), quality=95)

# Generate transparent PNG versions for clean compositing
make_transparent(clean_crop.copy()).save(os.path.join("public", "assets", "0xnull-primary-clean.png"))
make_transparent(focused_logo.copy()).save(os.path.join("public", "assets", "0xnull-logo-lockup.png"))
make_transparent(sym_crop.copy()).save(os.path.join("public", "assets", "0xnull-symbol.png"))
make_transparent(wm_crop.copy()).save(os.path.join("public", "assets", "0xnull-wordmark.png"))
make_transparent(wm_0x.copy()).save(os.path.join("public", "assets", "0xnull-wm-0x.png"))
make_transparent(wm_null.copy()).save(os.path.join("public", "assets", "0xnull-wm-null.png"))

print("Successfully created clean cropped logo assets without taglines!")
