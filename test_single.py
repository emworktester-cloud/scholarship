import os
import re
import pandas as pd
import easyocr
import fitz
import cv2
import numpy as np

def clean_amount(text):
    text = str(text).replace(',', '').strip()
    match = re.search(r'[\d.]+', text)
    if match:
        try:
            val = float(match.group(0))
            return f"{val:.2f}"
        except: pass
    return ''

def process_one_page():
    reader = easyocr.Reader(['th', 'en'])
    pdf_path = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
    output_excel = r"C:\Users\USER\Downloads\PND1_TEST_0168.xlsx"
    
    months_th = {"01": "มกราคม"}
    month_name = months_th["01"]
    
    print(f"Testing OCR on {pdf_path} (Page 2 only)")
    all_extracted_data = []
    
    doc = fitz.open(pdf_path)
    # Just page index 1 (the table)
    page = doc[1]
    pix = page.get_pixmap(dpi=200) 
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
    if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
    elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
        
    results = reader.readtext(img, width_ths=0.7, height_ths=0.7)
    
    boxes = []
    for bbox, text, conf in results:
        if conf < 0.2: continue
        x0 = min([pt[0] for pt in bbox])
        y_center = sum([pt[1] for pt in bbox]) / 4.0
        boxes.append({"x0": x0, "y_center": y_center, "text": text})
    
    boxes = sorted(boxes, key=lambda x: x['y_center'])
    rows, current_row, current_y = [], [], None
    for b in boxes:
        if current_y is None:
            current_y = b['y_center']
            current_row.append(b)
        elif abs(b['y_center'] - current_y) < 15:
            current_row.append(b)
            current_y = sum(x['y_center'] for x in current_row) / len(current_row)
        else:
            rows.append(current_row)
            current_row = [b]
            current_y = b['y_center']
    if current_row: rows.append(current_row)
        
    for row_boxes in rows:
        row_boxes = sorted(row_boxes, key=lambda x: x['x0'])
        clean_row = [str(x['text']).strip() for x in row_boxes]
        if len(clean_row) >= 6:
            has_tax_id = any(re.match(r'^\d{13}$', re.sub(r'\D', '', c)) for c in clean_row)
            if has_tax_id or (clean_row[0].isdigit() and len(clean_row[0]) < 5):
                all_extracted_data.append(clean_row)
                
    doc.close()
                
    target_cols = [
        "เดือน", "ลำดับที่", "เลขประจำตัวผู้เสียภาษีอากร", 
        "ชื่อผู้มีเงินได้", "ชื่อสกุล", "วัน เดือน ปี ที่จ่าย", 
        "จำนวนเงินได้ที่จ่ายในครั้งนี้", "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้", "เงื่อนไข"
    ]
    
    clean_records = []
    for r in all_extracted_data:
        padded = r + [''] * max(0, 8 - len(r))
        if len(r) == 7:
            name_surname = r[2].split()
            first_name = name_surname[0] if len(name_surname) > 0 else r[2]
            last_name = " ".join(name_surname[1:]) if len(name_surname) > 1 else ""
            clean_records.append({
                "เดือน": month_name, "ลำดับที่": padded[0], "เลขประจำตัวผู้เสียภาษีอากร": padded[1],
                "ชื่อผู้มีเงินได้": first_name, "ชื่อสกุล": last_name, "วัน เดือน ปี ที่จ่าย": padded[3],
                "จำนวนเงินได้ที่จ่ายในครั้งนี้": clean_amount(padded[4]),
                "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้": clean_amount(padded[5]), "เงื่อนไข": padded[6]
            })
        else: 
            clean_records.append({
                "เดือน": month_name, "ลำดับที่": padded[0], "เลขประจำตัวผู้เสียภาษีอากร": padded[1],
                "ชื่อผู้มีเงินได้": padded[2], "ชื่อสกุล": padded[3], "วัน เดือน ปี ที่จ่าย": padded[-4] if len(padded)>=4 else '',
                "จำนวนเงินได้ที่จ่ายในครั้งนี้": clean_amount(padded[-3] if len(padded)>=3 else ''),
                "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้": clean_amount(padded[-2] if len(padded)>=2 else ''),
                "เงื่อนไข": padded[-1] if len(padded)>1 else ''
            })
        
    final_df = pd.DataFrame(clean_records, columns=target_cols)
    final_df.to_excel(output_excel, index=False)
    print(f"Saved {output_excel} with {len(final_df)} rows.")

if __name__ == "__main__":
    import warnings
    warnings.filterwarnings('ignore')
    process_one_page()
