import requests, base64, fitz, cv2, numpy as np, json, os, glob, time
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed

API_KEY = "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"

def extract_names_from_page(pdf_path, page_num):
    doc = fitz.open(pdf_path)
    page = doc[page_num]
    pix = page.get_pixmap(dpi=300)
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
    if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
    elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    doc.close()

    # Crop Tax ID + Name column only
    crop_img = img[750:2300, 150:900]
    _, buffer = cv2.imencode('.png', crop_img)
    b64 = base64.b64encode(buffer).decode("utf-8")

    prompt = """สกัดข้อมูลจากตารางภาพนี้ทุกบรรทัดที่มีข้อมูล 
หา 'เลขประจำตัว 13 หลัก' (หรือส่วนที่เห็น) และ 'คำนำหน้า ชื่อ นามสกุล' อย่างระมัดระวังที่สุด
พิมพ์ออกมาเป็น JSON format เท่านั้น ห้ามพิมพ์ข้อความอื่น:
[
  {"tax_id": "3220300591503", "title": "นาย", "first_name": "สมชาย", "last_name": "ใจดี"},
  ...
]
ถ้าไม่มีข้อมูลหรืออ่านไม่ออก ให้ข้าม หรือใส่ค่าว่าง"""

    payload = {
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "user", "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
            ]}
        ],
        "temperature": 0.0,
        "response_format": {"type": "json_object"}
    }
    
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    
    for attempt in range(3):
        try:
            resp = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers, timeout=60)
            if resp.status_code == 200:
                txt = resp.json()["choices"][0]["message"]["content"]
                # Sometimes gpt-4o-mini returns {'data': [...]} or just [...] depending on json_object enforcement.
                try: 
                    jd = json.loads(txt)
                    if isinstance(jd, dict):
                        for k, v in jd.items():
                            if isinstance(v, list): return v
                        return [jd]
                    return jd
                except:
                    return []
            else:
                time.sleep(2)
        except Exception as e:
            time.sleep(2)
    return []

def process_file(excel_path, pdf_folder):
    if not os.path.exists(excel_path): return
    print(f"Processing {excel_path}...")
    xls = pd.ExcelFile(excel_path)
    dfs = {sheet: pd.read_excel(xls, sheet_name=sheet) for sheet in xls.sheet_names}
    
    pdf_files = sorted(glob.glob(os.path.join(pdf_folder, "*.pdf")))
    pdf_files = [f for f in pdf_files if not os.path.basename(f).replace(".pdf","").endswith(".1")]
    
    MONTHS_TH = {"01":"มกราคม","02":"กุมภาพันธ์","03":"มีนาคม","04":"เมษายน","05":"พฤษภาคม","06":"มิถุนายน","07":"กรกฎาคม","08":"สิงหาคม","09":"กันยายน","10":"ตุลาคม","11":"พฤศจิกายน","12":"ธันวาคม"}
    
    tax_name_mapping = {}
    
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {}
        for f in pdf_files:
            bname = os.path.basename(f)
            doc_len = fitz.open(f).page_count
            for p in range(1, doc_len):
                futures[executor.submit(extract_names_from_page, f, p)] = f
                
        for fut in as_completed(futures):
            res = fut.result()
            for row in res:
                tid = str(row.get('tax_id', '')).replace('-','').strip()
                if len(tid) >= 10:
                    tax_name_mapping[tid] = {
                        "t": row.get('title',''),
                        "f": row.get('first_name',''),
                        "l": row.get('last_name','')
                    }

    # Now populate Excel
    out_f = excel_path.replace("_No_Names.xlsx", "_Final.xlsx")
    with pd.ExcelWriter(out_f, engine='xlsxwriter') as writer:
        for sheet, df in dfs.items():
            if "เลขประจำตัวผู้เสียภาษีอากร" in df.columns:
                df["เลขประจำตัวผู้เสียภาษีอากร"] = df["เลขประจำตัวผู้เสียภาษีอากร"].astype(str)
                titles, firsts, lasts = [], [], []
                for idx, row in df.iterrows():
                    tid = str(row["เลขประจำตัวผู้เสียภาษีอากร"]).replace('-','').replace('.0','').strip()
                    matched = False
                    for k in tax_name_mapping.keys():
                        if k in tid or tid in k:
                            titles.append(tax_name_mapping[k]["t"])
                            firsts.append(tax_name_mapping[k]["f"])
                            lasts.append(tax_name_mapping[k]["l"])
                            matched = True
                            break
                    if not matched:
                        titles.append("")
                        firsts.append("")
                        lasts.append("")
                        
                if "คำนำหน้า" in df.columns: df["คำนำหน้า"] = titles
                if "ชื่อ" in df.columns: df["ชื่อ"] = firsts
                if "ชื่อสกุล" in df.columns: df["ชื่อสกุล"] = lasts
            df.to_excel(writer, sheet_name=sheet, index=False)
    print(f"Created {out_f}")

if __name__ == "__main__":
    process_file(r"C:\Users\USER\Downloads\PND1_2568_Result_No_Names.xlsx", r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1")
    process_file(r"C:\Users\USER\Downloads\PND1_2567_Result_No_Names.xlsx", r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1")
