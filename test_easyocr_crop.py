import fitz, cv2, numpy as np, easyocr

pdf_path = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
doc = fitz.open(pdf_path)
page = doc[1]
pix = page.get_pixmap(dpi=300)
img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n).copy()
if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
doc.close()

gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

# Crop roughly to the "ชื่อ" column and a bit of the surrounding area
crop_img = gray[750:2300, 390:850]

reader = easyocr.Reader(['th', 'en'])
results = reader.readtext(crop_img, width_ths=0.7, height_ths=0.7)

print("EasyOCR on strictly cropped names column:")
for bbox, text, conf in results:
    if conf > 0.1 and len(text.strip()) > 1:
        print(text.strip())
