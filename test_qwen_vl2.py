import requests, json, base64, fitz, os, sys

pdf_path = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"
OUTPUT = r"C:\Users\USER\.gemini\antigravity\scratch\test_qwen_result.json"

doc = fitz.open(pdf_path)
page = doc[1]
pix = page.get_pixmap(dpi=250)
temp_img = r"C:\Users\USER\.gemini\antigravity\scratch\temp_page.png"
pix.save(temp_img)
doc.close()

with open(temp_img, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

prompt = """คุณคือผู้เชี่ยวชาญในการอ่านเอกสารภาษีไทย ภ.ง.ด.1 (ใบแนบ)
จากรูปตารางนี้ ให้ดึงข้อมูลแต่ละแถวในตารางออกมาเป็น JSON array
แต่ละแถวประกอบด้วย:
- "ลำดับที่": เลขลำดับ
- "เลขประจำตัวผู้เสียภาษีอากร": เลข 13 หลัก (อ่านจากช่องที่มีตัวเลขแยกทีละหลัก ให้อ่านทีละหลักอย่างระมัดระวังครบทั้ง 13 หลัก)
- "คำนำหน้า": นาย/นาง/น.ส. ฯลฯ
- "ชื่อ": ชื่อจริง
- "ชื่อสกุล": นามสกุล
- "วัน_เดือน_ปี_ที่จ่าย": วันที่จ่ายเงินในรูปแบบ DD/MM/YYYY
- "เงินได้": จำนวนเงินได้ (ตัวเลข decimal มี .00)
- "ภาษีที่หัก": จำนวนเงินภาษีที่หักนำส่ง (ตัวเลข decimal มี .00)
- "เงื่อนไข": เลข 1, 2, หรือ 3

สำคัญมาก: เลขประจำตัวผู้เสียภาษีอากรต้องมี 13 หลักเสมอ ช่องนี้จะมีกรอบเล็กๆ แยกทีละหลัก ให้อ่านทุกหลักรวมถึงเลข 0 ข้างหน้าด้วย
ตอบเป็น JSON array เท่านั้น ไม่ต้องมี markdown code block ไม่ต้องมีคำอธิบายอื่น"""

payload = {
    "model": "qwen/qwen-2.5-vl-72b-instruct",
    "messages": [{"role": "user", "content": [
        {"type": "text", "text": prompt},
        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
    ]}],
    "temperature": 0.0,
    "max_tokens": 4000
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://localhost",
    "X-Title": "PND1 Extractor"
}

resp = requests.post(API_URL, json=payload, headers=headers, timeout=120)
content = resp.json()["choices"][0]["message"]["content"]

# Clean markdown if present
cleaned = content.strip()
if cleaned.startswith("```"):
    cleaned = cleaned.split("\n", 1)[1]
    cleaned = cleaned.rsplit("```", 1)[0]

rows = json.loads(cleaned)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=2)

print(f"Saved {len(rows)} rows to {OUTPUT}")
os.remove(temp_img)
