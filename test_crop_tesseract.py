import fitz, cv2, numpy as np, pytesseract

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
import os
os.environ["TESSDATA_PREFIX"] = r"C:\Users\USER\.gemini\antigravity\scratch\tessdata"

pdf_path = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
doc = fitz.open(pdf_path)
page = doc[1]
pix = page.get_pixmap(dpi=300)
img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n).copy()
if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
doc.close()

gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

# Tesseract fails on small/thin Thai fonts. We need to threshold and upscale.
# We'll just define a rough bounding box for the first name in the table:
# Approx coords for "ชื่อ นาง ศิริมาส   ชื่อสกุล ล... " at DPI 300
crop_img = gray[780:850, 480:1200]

# Pre-processing for Tesseract
# 1. Resize x3
crop_img = cv2.resize(crop_img, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)
# 2. Adaptive Threshold
thresh = cv2.adaptiveThreshold(crop_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 10)
# 3. Median Blur to remove noise
thresh = cv2.medianBlur(thresh, 3)

cv2.imwrite("test_name_crop.png", thresh)

# Try Tesseract
text = pytesseract.image_to_string(thresh, lang="tha", config='--psm 7')
print(f"Name from Tesseract: {text.strip()}")
