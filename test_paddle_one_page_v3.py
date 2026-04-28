import os, fitz, cv2, numpy as np
from paddleocr import PaddleOCR
ocr = PaddleOCR(use_angle_cls=False, lang='th', ocr_version='PP-OCRv3')
pdf = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
doc = fitz.open(pdf)
page = doc[1]
pix = page.get_pixmap(dpi=200)
img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n).copy()
if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
doc.close()

crop_img = img[750:1100, 390:900]
results = ocr.ocr(crop_img, cls=False)
if results and results[0]:
    for res in results[0]:
        print("Paddle Thai v3:", res[1][0])
