import requests, json, base64

API_KEY = "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"

temp_img = r"C:\Users\USER\.gemini\antigravity\scratch\test_name_crop.png"
with open(temp_img, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("utf-8")

prompt = "นี่คือรูปช่องชื่อ นามสกุลภาษาไทย พิมพ์มาแค่ ชื่อและนามสกุล ที่เห็นในภาพ ห้ามแต่งชื่อขึ้นมาเองเด็ดขาด ถ้าอ่านไม่ออกให้ตอบแค่คำว่า 'อ่านไม่ออก'"

models_to_test = [
    "qwen/qwen3.6-plus-preview:free"
]

for model in models_to_test:
    print(f"Testing {model}...")
    headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
        ]}],
        "temperature": 0.0
    }
    
    try:
        resp = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers)
        if resp.status_code == 200:
            print(resp.json()["choices"][0]["message"]["content"])
        else:
            print(f"Error: {resp.status_code} {resp.text[:100]}")
    except Exception as e:
        print(f"Failed: {e}")
