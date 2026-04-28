import os, glob, re, time
import pandas as pd
import fitz
import cv2
import numpy as np
from paddleocr import PaddleOCR

# Load PaddleOCR pointing to Thai language
ocr = PaddleOCR(use_angle_cls=False, lang='th', show_log=False)

def clean_amount(text):
    text = str(text).replace(',', '').strip()
    match = re.search(r'[\d.]+', text)
    if match:
        try:
            val = float(match.group(0))
            return f"{val:.2f}"
        except: pass
    return ''

MONTHS_TH = {"01":"มกราคม","02":"กุมภาพันธ์","03":"มีนาคม","04":"เมษายน","05":"พฤษภาคม","06":"มิถุนายน","07":"กรกฎาคม","08":"สิงหาคม","09":"กันยายน","10":"ตุลาคม","11":"พฤศจิกายน","12":"ธันวาคม"}
TARGET_COLS = ["เดือน", "ลำดับที่", "เลขประจำตัวผู้เสียภาษีอากร", "คำนำหน้า", "ชื่อ", "ชื่อสกุล", "วัน เดือน ปี ที่จ่าย", "จำนวนเงินได้ที่จ่ายในครั้งนี้", "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้", "เงื่อนไข"]

def process_folder(folder_path, output_excel):
    pdf_files = sorted(glob.glob(os.path.join(folder_path, "*.pdf")))
    pdf_files = [f for f in pdf_files if not os.path.basename(f).replace(".pdf","").endswith(".1")]
    
    with pd.ExcelWriter(output_excel, engine="xlsxwriter") as writer:
        for f in pdf_files:
            bname = os.path.basename(f)
            month_code = bname[:2]
            month_name = MONTHS_TH.get(month_code, month_code)
            
            print(f"Processing {bname} -> {month_name}")
            doc = fitz.open(f)
            all_records = []
            
            for page_num in range(1, len(doc)):
                page = doc[page_num]
                pix = page.get_pixmap(dpi=200)
                img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n).copy()
                if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
                elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
                
                # Use PaddleOCR on the whole image
                results = ocr.ocr(img, cls=False)
                if not results or not results[0]: continue
                
                boxes = []
                for res in results[0]:
                    box = res[0]
                    text = res[1][0].strip()
                    conf = res[1][1]
                    if conf > 0.5 and text:
                        x0 = min([pt[0] for pt in box])
                        y_center = sum([pt[1] for pt in box]) / 4.0
                        boxes.append({"text": text, "x0": x0, "y_center": y_center})
                
                boxes = sorted(boxes, key=lambda x: x['y_center'])
                rows, current_row, current_y = [], [], None
                for b in boxes:
                    if current_y is None:
                        current_y = b['y_center']
                        current_row.append(b)
                    elif abs(b['y_center'] - current_y) < 20:
                        current_row.append(b)
                        current_y = sum(x['y_center'] for x in current_row) / len(current_row)
                    else:
                        rows.append(current_row)
                        current_row = [b]
                        current_y = b['y_center']
                if current_row: rows.append(current_row)
                
                for r in rows:
                    r = sorted(r, key=lambda x: x['x0'])
                    texts = [x['text'] for x in r]
                    if len(texts) >= 5:
                        has_tax_id = any(re.match(r'^\d{13}$', re.sub(r'\D', '', c)) for c in texts)
                        if has_tax_id or (texts[0].isdigit() and len(texts[0]) < 5):
                            padded = texts + [''] * max(0, 9 - len(texts))
                            
                            # Naive name split handling for OCR
                            if len(texts) == 7:
                                name_parts = texts[2].split()
                                title = ""
                                first = name_parts[0] if len(name_parts) > 0 else texts[2]
                                last = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
                                all_records.append({
                                    "เดือน": month_name, "ลำดับที่": padded[0], "เลขประจำตัวผู้เสียภาษีอากร": padded[1],
                                    "คำนำหน้า": title, "ชื่อ": first, "ชื่อสกุล": last, "วัน เดือน ปี ที่จ่าย": padded[3],
                                    "จำนวนเงินได้ที่จ่ายในครั้งนี้": clean_amount(padded[4]),
                                    "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้": clean_amount(padded[5]), "เงื่อนไข": padded[6]
                                })
                            else:
                                title = ""
                                first = padded[2]
                                last = padded[3]
                                all_records.append({
                                    "เดือน": month_name, "ลำดับที่": padded[0], "เลขประจำตัวผู้เสียภาษีอากร": padded[1],
                                    "คำนำหน้า": title, "ชื่อ": first, "ชื่อสกุล": last, "วัน เดือน ปี ที่จ่าย": padded[-4] if len(padded)>=4 else '',
                                    "จำนวนเงินได้ที่จ่ายในครั้งนี้": clean_amount(padded[-3] if len(padded)>=3 else ''),
                                    "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้": clean_amount(padded[-2] if len(padded)>=2 else ''),
                                    "เงื่อนไข": padded[-1] if len(padded)>1 else ''
                                })
                                
            doc.close()
            import gc; gc.collect()
            
            if all_records:
                df = pd.DataFrame(all_records, columns=TARGET_COLS)
                df.to_excel(writer, sheet_name=month_name[:31], index=False)
            else:
                pd.DataFrame([["ไม่พบข้อมูล"]]).to_excel(writer, sheet_name=month_name[:31], index=False, header=False)
                
    print(f"DONE SAVING {output_excel}")

if __name__ == "__main__":
    import warnings
    warnings.filterwarnings('ignore')
    process_folder(r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1", r"C:\Users\USER\Downloads\PND1_2568_Paddle.xlsx")
    process_folder(r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1", r"C:\Users\USER\Downloads\PND1_2567_Paddle.xlsx")
