import requests
r = requests.get('https://openrouter.ai/api/v1/models')
for m in r.json().get('data', []):
    pricing = m.get('pricing', {})
    if pricing.get('prompt') == '0' and pricing.get('completion') == '0':
        print(m['id'])
