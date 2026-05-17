# -*- coding: utf-8 -*-
import os
import pandas as pd

base_dir = r'C:\Users\USER\.gemini\antigravity\scratch\scholar\scholar-forms'
excel_path = os.path.join(base_dir, 'สรุปรายการเอกสารทั้งหมด_ฉบับสมบูรณ์.xlsx')

df = pd.read_excel(excel_path)
group_name = 'นทร.1'
group_dir = os.path.join(base_dir, group_name)

mapping = {}
for _, row in df.iterrows():
    if group_name in str(row['กลุ่มงานที่รับผิดชอบ']):
        orig_name = str(row['ชื่อไฟล์ (เอกสาร)'])
        doc_id = str(row['รหัสเอกสาร'])
        
        # Check if already starts with ID
        if orig_name.startswith(doc_id):
            continue
            
        new_name = f"{doc_id}_{orig_name}"
        mapping[orig_name] = new_name

renamed_count = 0
for root, dirs, files in os.walk(group_dir):
    for file in files:
        if file in mapping:
            old_path = os.path.join(root, file)
            new_path = os.path.join(root, mapping[file])
            try:
                os.rename(old_path, new_path)
                renamed_count += 1
            except Exception as e:
                print(f"Error renaming {file}: {e}")
        else:
            # Maybe the file was already renamed in a previous run?
            pass

print(f"Successfully renamed {renamed_count} files in {group_name}")
