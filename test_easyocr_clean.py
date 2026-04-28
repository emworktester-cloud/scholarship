import os, json, fitz, cv2, numpy as np, easyocr

pdf_path = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
doc = fitz.open(pdf_path)
page = doc[1]
pix = page.get_pixmap(dpi=200)
img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n).copy()
if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
doc.close()

gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 5)

# Remove lines for better OCR
h_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
cv2.drawContours(img, cv2.findContours(cv2.morphologyEx(thresh, cv2.MORPH_OPEN, h_kernel, iterations=2), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0], -1, (255,255,255), 3)

v_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
cv2.drawContours(img, cv2.findContours(cv2.morphologyEx(thresh, cv2.MORPH_OPEN, v_kernel, iterations=2), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0], -1, (255,255,255), 3)

reader = easyocr.Reader(['th', 'en'])
results = reader.readtext(img, width_ths=0.7, height_ths=0.7)

boxes = []
for bbox, text, conf in results:
    if conf > 0.1:
        text = text.strip()
        if text:
            x0 = min([pt[0] for pt in bbox])
            y_center = sum([pt[1] for pt in bbox]) / 4.0
            boxes.append({"text": text, "x0": x0, "y_center": y_center})

boxes.sort(key=lambda x: x['y_center'])
rows, curr_row, curr_y = [], [], None
for b in boxes:
    if curr_y is None:
        curr_y = b['y_center']
        curr_row.append(b)
    elif abs(b['y_center'] - curr_y) < 20:
        curr_row.append(b)
        curr_y = sum(x['y_center'] for x in curr_row) / len(curr_row)
    else:
        rows.append(curr_row)
        curr_row = [b]
        curr_y = b['y_center']
if curr_row: rows.append(curr_row)

output = []
for r in rows:
    r.sort(key=lambda x: x['x0'])
    texts = [x['text'] for x in r]
    if len(texts) > 3:
        output.append(" | ".join(texts))

with open("easyocr_test.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Done. Found {len(output)} rows with EasyOCR locally.")
