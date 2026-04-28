import requests, base64

API_KEY = "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"
temp_img = r"C:\Users\USER\.gemini\antigravity\scratch\test_name_crop.png"
with open(temp_img, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

prompt = "นี่คือภาพคำนำหน้าและชื่อ-นามสกุลในตาราง พิมพ์ชื่อที่เห็นตามจริง 100% ห้ามเติม ห้ามแต่ง ถ้าอ่านไม่ออกให้ตอบว่า อ่านไม่ออก"

payload = {
    "model": "openai/gpt-4o-2024-11-20",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
            ]
        }
    ],
    "temperature": 0.0
}
headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
resp = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
try:
    print("Qwen on Crop:", resp.json()["choices"][0]["message"]["content"])
except:
    print("Error:", resp.text)
