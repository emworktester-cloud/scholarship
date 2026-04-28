# -*- coding: utf-8 -*-
"""
PND.1 Tax Data Extractor using Qwen Vision AI (OpenRouter)
Processes all PDF files in 2567 and 2568 folders
"""
import requests, json, base64, fitz, os, sys, glob, time, traceback
import pandas as pd

API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "qwen/qwen-2.5-vl-72b-instruct"

PROMPT = """คุณคือผู้เชี่ยวชาญในการอ่านเอกสารภาษีไทย ภ.ง.ด.1 (ใบแนบ)
จากรูปตารางนี้ ให้ดึงข้อมูลแต่ละแถวที่มีข้อมูลพนักงานในตารางออกมาเป็น JSON array
ข้ามแถวที่เป็นหัวตาราง แถวรวม หรือแถวว่าง

แต่ละแถวประกอบด้วย:
- "ลำดับที่": เลขลำดับ (ตัวเลข)
- "เลขประจำตัวผู้เสียภาษีอากร": เลข 13 หลัก (อ่านจากช่องที่มีตัวเลขแยกทีละหลักในกรอบเล็กๆ ให้อ่านทุกหลักรวมเลข 0 นำหน้าด้วย ต้องได้ครบ 13 หลักเสมอ)
- "คำนำหน้า": นาย/นาง/น.ส./นางสาว ฯลฯ
- "ชื่อ": ชื่อจริง
- "ชื่อสกุล": นามสกุล
- "วัน_เดือน_ปี_ที่จ่าย": วันที่จ่ายเงิน DD/MM/YYYY (ปี พ.ศ.)
- "เงินได้": จำนวนเงินได้ที่จ่าย (ตัวเลข decimal 2 ตำแหน่ง เช่น 30000.00)
- "ภาษีที่หัก": จำนวนภาษีหัก ณ ที่จ่าย (ตัวเลข decimal 2 ตำแหน่ง)
- "เงื่อนไข": ตัวเลข 1, 2 หรือ 3

กฎสำคัญ:
1. เลขประจำตัวผู้เสียภาษีอากร ต้องมี 13 หลักเสมอ อ่านทีละช่อง 
2. ถ้าเป็นแถวข้อมูลจริงที่ต้องการแยก (ส่วนที่ระบุ "จ่ายล่วงเวลา / จ่ายค่าจ้าง" ให้ข้ามไป ดึงเฉพาะข้อมูลที่มีเลข 13 หลัก)
3. ตอบเป็น JSON array เท่านั้น ไม่ต้องมี markdown code block ไม่ต้องมีคำอธิบาย"""

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://localhost",
    "X-Title": "PND1 Extractor"
}

MONTHS_TH = {
    "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
    "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
    "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
}

TARGET_COLS = [
    "เดือน", "ลำดับที่", "เลขประจำตัวผู้เสียภาษีอากร",
    "คำนำหน้า", "ชื่อ", "ชื่อสกุล",
    "วัน เดือน ปี ที่จ่าย", "จำนวนเงินได้ที่จ่ายในครั้งนี้",
    "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้", "เงื่อนไข"
]

LOG_FILE = os.path.join(os.path.dirname(__file__), "qwen_extraction.log")

def log(msg):
    ts = time.strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def extract_page(page, temp_dir):
    """Convert page to image, send to Qwen VL, return parsed rows."""
    pix = page.get_pixmap(dpi=250)
    temp_img = os.path.join(temp_dir, "temp_ocr.png")
    pix.save(temp_img)
    
    with open(temp_img, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")
    
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": [
            {"type": "text", "text": PROMPT},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
        ]}],
        "temperature": 0.0,
        "max_tokens": 8000
    }
    
    for attempt in range(3):
        try:
            resp = requests.post(API_URL, json=payload, headers=HEADERS, timeout=180)
            if resp.status_code == 200:
                content = resp.json()["choices"][0]["message"]["content"]
                cleaned = content.strip()
                if cleaned.startswith("```"):
                    cleaned = cleaned.split("\n", 1)[1]
                    cleaned = cleaned.rsplit("```", 1)[0]
                rows = json.loads(cleaned)
                os.remove(temp_img)
                return rows
            elif resp.status_code == 429:
                log(f"  Rate limited, waiting 30s (attempt {attempt+1})")
                time.sleep(30)
            else:
                log(f"  API error {resp.status_code}: {resp.text[:200]}")
                time.sleep(10)
        except json.JSONDecodeError as e:
            log(f"  JSON parse error: {e}, raw: {content[:300]}")
            os.remove(temp_img)
            return []
        except Exception as e:
            log(f"  Request error: {e}")
            time.sleep(10)
    
    if os.path.exists(temp_img):
        os.remove(temp_img)
    return []

def process_folder(folder_path, output_excel, year_label):
    """Process all PDFs in a folder, output to Excel with monthly tabs."""
    log(f"=== Processing {year_label}: {folder_path} ===")
    
    pdf_files = sorted(glob.glob(os.path.join(folder_path, "*.pdf")))
    if not pdf_files:
        log(f"No PDFs found in {folder_path}")
        return
    
    # Filter out duplicate files like 0168.1.pdf
    main_pdfs = [f for f in pdf_files if not os.path.basename(f).replace(".pdf","").endswith(".1")]
    log(f"Found {len(main_pdfs)} PDF files")
    
    temp_dir = os.path.dirname(__file__)
    
    with pd.ExcelWriter(output_excel, engine="xlsxwriter") as writer:
        for pdf_path in main_pdfs:
            filename = os.path.basename(pdf_path)
            month_code = filename[:2]
            month_name = MONTHS_TH.get(month_code, month_code)
            sheet_name = month_name[:31]
            
            log(f"\nProcessing {filename} -> Sheet [{sheet_name}]")
            all_rows = []
            
            try:
                doc = fitz.open(pdf_path)
                total_pages = len(doc)
                
                # Pages 2 onwards (index 1+) are the attachment tables
                for page_idx in range(1, total_pages):
                    log(f"  Page {page_idx+1}/{total_pages}...")
                    page = doc[page_idx]
                    rows = extract_page(page, temp_dir)
                    log(f"  -> Got {len(rows)} rows")
                    all_rows.extend(rows)
                    time.sleep(1)  # Small delay between pages
                
                doc.close()
                
            except Exception as e:
                log(f"  ERROR processing {filename}: {e}")
                traceback.print_exc()
            
            # Convert to DataFrame
            records = []
            for r in all_rows:
                records.append({
                    "เดือน": month_name,
                    "ลำดับที่": r.get("ลำดับที่", ""),
                    "เลขประจำตัวผู้เสียภาษีอากร": r.get("เลขประจำตัวผู้เสียภาษีอากร", ""),
                    "คำนำหน้า": r.get("คำนำหน้า", ""),
                    "ชื่อ": r.get("ชื่อ", ""),
                    "ชื่อสกุล": r.get("ชื่อสกุล", ""),
                    "วัน เดือน ปี ที่จ่าย": r.get("วัน_เดือน_ปี_ที่จ่าย", ""),
                    "จำนวนเงินได้ที่จ่ายในครั้งนี้": r.get("เงินได้", ""),
                    "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้": r.get("ภาษีที่หัก", ""),
                    "เงื่อนไข": r.get("เงื่อนไข", "")
                })
            
            if records:
                df = pd.DataFrame(records, columns=TARGET_COLS)
                df.to_excel(writer, sheet_name=sheet_name, index=False)
                log(f"  DONE: {len(df)} total rows for {month_name}")
            else:
                pd.DataFrame([["ไม่พบข้อมูล"]]).to_excel(writer, sheet_name=sheet_name, index=False, header=False)
                log(f"  WARNING: No data extracted for {month_name}")
    
    log(f"=== SAVED: {output_excel} ===")

def main():
    log("=" * 60)
    log("PND.1 Extractor using Qwen Vision AI")
    log("=" * 60)
    
    # Process 2568
    process_folder(
        r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1",
        r"C:\Users\USER\Downloads\PND1_2568_Result.xlsx",
        "2568"
    )
    
    # Process 2567
    process_folder(
        r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1",
        r"C:\Users\USER\Downloads\PND1_2567_Result.xlsx",
        "2567"
    )
    
    log("\n" + "=" * 60)
    log("ALL DONE!")
    log("=" * 60)

if __name__ == "__main__":
    main()
