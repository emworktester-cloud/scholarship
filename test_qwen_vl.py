import requests, json, base64, fitz, os, sys
import numpy as np

# Test: convert page 2 of 0168.pdf to image, send to Qwen VL
pdf_path = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
API_KEY = "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"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

doc = fitz.open(pdf_path)
page = doc[1]  # Page 2 (index 1) = first attachment table
pix = page.get_pixmap(dpi=250)

# Save as PNG to temp
temp_img = r"C:\Users\USER\.gemini\antigravity\scratch\temp_page.png"
pix.save(temp_img)
doc.close()

# Encode to base64
with open(temp_img, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

prompt = """คุณคือผู้เชี่ยวชาญในการอ่านเอกสารภาษีไทย ภ.ง.ด.1 (ใบแนบ)
จากรูปตารางนี้ ให้ดึงข้อมูลแต่ละแถวในตารางออกมาเป็น JSON array
แต่ละแถวประกอบด้วย:
- "ลำดับที่": เลขลำดับ
- "เลขประจำตัวผู้เสียภาษีอากร": เลข 13 หลัก (ให้อ่านทีละหลักอย่างระมัดระวัง)
- "คำนำหน้า": นาย/นาง/น.ส. ฯลฯ
- "ชื่อ": ชื่อจริง
- "ชื่อสกุล": นามสกุล
- "วัน_เดือน_ปี_ที่จ่าย": วันที่จ่ายเงินในรูปแบบ DD/MM/YYYY
- "เงินได้": จำนวนเงินได้ (ตัวเลข ไม่ต้องมี comma)
- "ภาษีที่หัก": จำนวนเงินภาษีที่หักนำส่ง (ตัวเลข ไม่ต้องมี comma)
- "เงื่อนไข": เลข 1, 2, หรือ 3

ตอบเป็น JSON array เท่านั้น ไม่ต้องมีคำอธิบายอื่น
ตัวอย่างผลลัพธ์:
[
  {"ลำดับที่": "1", "เลขประจำตัวผู้เสียภาษีอากร": "1234567890123", "คำนำหน้า": "นาย", "ชื่อ": "สมชาย", "ชื่อสกุล": "ใจดี", "วัน_เดือน_ปี_ที่จ่าย": "31/01/2567", "เงินได้": "30000.00", "ภาษีที่หัก": "1500.00", "เงื่อนไข": "1"}
]"""

payload = {
    "model": "qwen/qwen-2.5-vl-72b-instruct",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
            ]
        }
    ],
    "temperature": 0.1,
    "max_tokens": 4000
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://localhost",
    "X-Title": "PND1 Extractor"
}

print("Sending to Qwen VL API...")
resp = requests.post(API_URL, json=payload, headers=headers, timeout=120)
print(f"Status: {resp.status_code}")

if resp.status_code == 200:
    data = resp.json()
    content = data["choices"][0]["message"]["content"]
    print("\n=== RAW RESPONSE ===")
    print(content)
    
    # Try parse JSON
    try:
        # Remove markdown code blocks if present
        cleaned = content.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1]
            cleaned = cleaned.rsplit("```", 1)[0]
        rows = json.loads(cleaned)
        print(f"\n=== PARSED {len(rows)} ROWS ===")
        for r in rows:
            print(r)
    except Exception as e:
        print(f"JSON parse error: {e}")
else:
    print(f"Error: {resp.text}")

# Cleanup temp
os.remove(temp_img)
