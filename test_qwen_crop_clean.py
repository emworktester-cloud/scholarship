import requests, base64, fitz, cv2, numpy as np

API_KEY = "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"

pdf_path = r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf"
doc = fitz.open(pdf_path)
page = doc[1] # Page 2
pix = page.get_pixmap(dpi=300)
img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
if pix.n == 4: img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
elif pix.n == 1: img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
doc.close()

# Crop specifically the first row, names only.
# In PDF standard A4: x from 450 to 1100, y from 600 to 2200 for names
# Let's crop just row 1:
crop_img = img[750:850, 400:1200]
cv2.imwrite(r"C:\Users\USER\.gemini\antigravity\scratch\clean_crop.png", crop_img)

with open(r"C:\Users\USER\.gemini\antigravity\scratch\clean_crop.png", "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

prompt = "อ่านชื่อภาษาไทยที่เห็นในภาพ ขอเป็นคำนำหน้า ชื่อ และ นามสกุล เท่านั้น. ตอบกลับเป็นรูปแบบ: [คำนำหน้า] [ชื่อ] [นามสกุล]"
payload = {
    "model": "openai/gpt-4o-2024-11-20",
    "messages": [
        {"role": "user", "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
        ]}
    ],
    "temperature": 0.0
}
headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
resp = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
try: print("GPT-4o on Clean Crop:", resp.json()["choices"][0]["message"]["content"])
except: print("Error:", resp.text)
