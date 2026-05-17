import pandas as pd
import os

base_dir = r'C:\Users\USER\.gemini\antigravity\scratch\scholar\scholar-forms'
master_file = os.path.join(base_dir, 'รวมรายการแบบฟอร์มเอกสารทั้งหมด.xlsx')

df = pd.read_excel(master_file)

# Fill NaN with empty string to avoid groupby errors
df = df.fillna('')

grouped = df.groupby(['ชื่อไฟล์ (เอกสาร)', 'ระยะที่ใช้', 'ประเภท', 'รายละเอียด', 'หมายเหตุ / ข้อสังเกต', 'ลำดับการเกิด (Timeline)']).agg({
    'กลุ่มงานที่รับผิดชอบ': lambda x: ', '.join(sorted(set(x)))
}).reset_index()

grouped = grouped.sort_values('ลำดับการเกิด (Timeline)')

counters = {}
def generate_id(phase, type_str):
    if phase == 'ก่อนเดินทางไปศึกษา': p = 'PRE'
    elif phase == 'ระหว่างศึกษา': p = 'DUR'
    else: p = 'PST'
    
    if type_str == 'แบบฟอร์ม/คำขอ': t = 'FM'
    elif type_str == 'สัญญา/ค้ำประกัน': t = 'CT'
    elif type_str == 'หนังสือราชการ': t = 'LT'
    else: t = 'DC'
    
    key = f'{p}-{t}'
    counters[key] = counters.get(key, 0) + 1
    return f'{key}-{counters[key]:03d}'

grouped['รหัสเอกสาร'] = grouped.apply(lambda row: generate_id(row['ระยะที่ใช้'], row['ประเภท']), axis=1)

cols = ['ลำดับการเกิด (Timeline)', 'รหัสเอกสาร', 'ชื่อไฟล์ (เอกสาร)', 'รายละเอียด', 'หมายเหตุ / ข้อสังเกต', 'ประเภท', 'ระยะที่ใช้', 'กลุ่มงานที่รับผิดชอบ']
grouped = grouped[cols]

excel_path = os.path.join(base_dir, 'สรุปรายการเอกสารทั้งหมด.xlsx')
with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    grouped.to_excel(writer, index=False, sheet_name='Form Inventory')
    worksheet = writer.sheets['Form Inventory']
    worksheet.column_dimensions['A'].width = 15
    worksheet.column_dimensions['B'].width = 15
    worksheet.column_dimensions['C'].width = 45
    worksheet.column_dimensions['D'].width = 50
    worksheet.column_dimensions['E'].width = 50
    worksheet.column_dimensions['F'].width = 15
    worksheet.column_dimensions['G'].width = 18
    worksheet.column_dimensions['H'].width = 25

md_lines = []
for _, row in grouped.iterrows():
    line = f"| {row['ลำดับการเกิด (Timeline)']} | **{row['รหัสเอกสาร']}** | {row['ชื่อไฟล์ (เอกสาร)']} | {row['รายละเอียด']} | {row['หมายเหตุ / ข้อสังเกต']} | {row['ประเภท']} | {row['ระยะที่ใช้']} | {row['กลุ่มงานที่รับผิดชอบ']} |"
    md_lines.append(line)

with open(os.path.join(base_dir, 'md_table.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(md_lines))

print('Done')
