# -*- coding: utf-8 -*-
import os
import pandas as pd

base_dir = r'C:\Users\USER\.gemini\antigravity\scratch\scholar\scholar-forms'
groups = ['นทร.1', 'นทร.2', 'นทร.3', 'นทร.4', 'สนร.']
phase_codes = {'ก่อนเดินทางไปศึกษา': 'PRE', 'ระหว่างศึกษา': 'DUR', 'สำเร็จการศึกษา': 'PST'}

all_files = []

for group in groups:
    group_dir = os.path.join(base_dir, group)
    if not os.path.exists(group_dir):
        continue
    for root, dirs, files in os.walk(group_dir):
        for file in files:
            if file.endswith('.csv') or file.endswith('.xlsx'):
                continue
            
            rel_path = os.path.relpath(root, group_dir)
            phase_name = rel_path.split('\\')[0] if '\\' in rel_path else rel_path
            if phase_name == '.':
                continue
                
            all_files.append({
                'กลุ่มงานที่รับผิดชอบ': group,
                'ระยะที่ใช้': phase_name,
                'ชื่อไฟล์ (เอกสาร)': file
            })

df = pd.DataFrame(all_files)

def get_description(filename):
    f_lower = filename.lower()
    if 'สัญญา' in f_lower or 'ค้ำประกัน' in f_lower: return 'เอกสารสัญญาสำหรับการรับทุนและ/หรือสัญญาค้ำประกัน'
    if 'เบิก' in f_lower or 'รับเงิน' in f_lower or 'จ่าย' in f_lower: return 'เอกสารประกอบการขอเบิกจ่ายเงิน หรือใบสำคัญรับเงิน'
    if 'ความก้าวหน้า' in f_lower or 'รายงานศึกษา' in f_lower or 'แบบรายงาน' in f_lower: return 'ฟอร์มการรายงานผลการศึกษา ความก้าวหน้า'
    if 'ตรวจสุขภาพ' in f_lower or 'จิตวิทยา' in f_lower: return 'แบบฟอร์มรายงานผลการตรวจสุขภาพร่างกาย/จิตวิทยา'
    if 'เดินทาง' in f_lower or 'วีซ่า' in f_lower or 'visa' in f_lower: return 'เอกสารประกอบการเดินทาง จองตั๋ว หรือขอวีซ่า'
    if 'อนุมัติ' in f_lower or 'พิจารณา' in f_lower: return 'หนังสือแจ้งผลการอนุมัติ หรือขออนุมัติตัวบุคคล/ปรับเปลี่ยน'
    if 'สำเร็จ' in f_lower or 'สิ้นสุด' in f_lower: return 'แบบฟอร์มรายงานการสำเร็จการศึกษา หรือสิ้นสุดสถานะ'
    if 'ส่งตัว' in f_lower or 'รายงานตัว' in f_lower or 'กลับเข้า' in f_lower: return 'เอกสารรายงานตัวส่งตัวกลับเข้าปฏิบัติราชการ หรือรายงานตัวกลับศึกษา'
    if 'consent' in f_lower or 'release' in f_lower or 'ยินยอม' in f_lower: return 'หนังสือให้ความยินยอมสำหรับการดำเนินการ/เปิดเผยข้อมูล'
    if 'ประวัติ' in f_lower or 'information' in f_lower: return 'แบบฟอร์มกรอกข้อมูลประวัติส่วนตัวและข้อมูลติดต่อ'
    if 'ตอบรับ' in f_lower: return 'หนังสือตอบรับจากส่วนราชการ/หน่วยงาน'
    if 'คำสั่ง' in f_lower or 'งบ' in f_lower or 'ทับตำแหน่ง' in f_lower: return 'ร่างคำสั่งจัดสรรอัตรากำลังหรือตั้งงบประมาณ'
    if 'ความจำนง' in f_lower or 'รับราชการ' in f_lower: return 'แบบแสดงความจำนงขอรับการจัดสรร/บรรจุเข้ารับราชการ'
    if 'คำนวณ' in f_lower: return 'เอกสารการคำนวณการปฏิบัติราชการชดใช้ทุน'
    if 'รับรอง' in f_lower: return 'หนังสือรับรองสถานะ หรือรับรองการเป็นนักเรียนทุน'
    return 'เอกสารอ้างอิง/แบบฟอร์มทั่วไปของนักเรียนทุน'

df['รายละเอียด'] = df['ชื่อไฟล์ (เอกสาร)'].apply(get_description)

def get_type(filename):
    f_lower = filename.lower()
    if 'สัญญา' in f_lower or 'ค้ำประกัน' in f_lower or 'รับรองผู้ค้ำ' in f_lower or 'ยินยอม' in f_lower: return 'สัญญา/ค้ำประกัน'
    if 'หนังสือ' in f_lower or 'ร่าง' in f_lower or 'แจ้ง' in f_lower or 'พิจารณา' in f_lower or 'ตอบรับ' in f_lower: return 'หนังสือราชการ'
    if 'แบบ' in f_lower or 'form' in f_lower or 'ทะเบียน' in f_lower or 'บันทึก' in f_lower or 'คำขอ' in f_lower or 'รายงาน' in f_lower: return 'แบบฟอร์ม/คำขอ'
    return 'เอกสาร/หลักฐาน'

df['ประเภท'] = df['ชื่อไฟล์ (เอกสาร)'].apply(get_type)

def get_remarks(row):
    filename = str(row['ชื่อไฟล์ (เอกสาร)']).lower()
    remarks = []
    if 'สัญญา' in filename or 'ค้ำประกัน' in filename: remarks.append('ต้องมีลายเซ็นผู้รับทุน ผู้ค้ำประกัน และพยานครบถ้วนตามระเบียบ ก.พ.')
    if 'ความก้าวหน้า' in filename or 'แบบรายงาน' in filename: remarks.append('นทร. ต้องดำเนินการส่งเป็นประจำทุกภาคเรียน')
    if 'อนุมัติ' in filename and 'หนังสือ' in filename: remarks.append('เป็นเอกสารที่ต้องใช้เวลาพิจารณาจาก ก.พ. หรือต้นสังกัด (ขึ้นอยู่กับสายงาน)')
    if 'เบิกจ่าย' in filename or 'รับเงิน' in filename: remarks.append('ต้องแนบหลักฐานการจ่ายเงินจริง (ใบเสร็จ) ประกอบด้วยเสมอ')
    if 'ตรวจสุขภาพ' in filename: remarks.append('ใบรับรองแพทย์และผลจิตวิทยาต้องไม่หมดอายุ (ปกติมีอายุไม่เกิน 6 เดือน - 1 ปี)')
    if 'consent' in filename or 'release' in filename: remarks.append('เอกสารสำคัญทางกฎหมายสำหรับการประสานงานข้ามประเทศ (PDPA/GDPR)')
    if filename.endswith('.pdf'): remarks.append('[รูปแบบ PDF]')
    elif filename.endswith('.doc') or filename.endswith('.docx'): remarks.append('[รูปแบบไฟล์แก้ไขได้ Word]')
    if not remarks: remarks.append('ใช้เป็นเอกสารอ้างอิงประกอบกระบวนการ')
    return ' | '.join(remarks)

df['หมายเหตุ / ข้อสังเกต'] = df.apply(get_remarks, axis=1)

def get_timeline_order(row):
    filename = str(row['ชื่อไฟล์ (เอกสาร)']).lower()
    phase = str(row['ระยะที่ใช้'])
    if phase == 'ก่อนเดินทางไปศึกษา':
        base = 100
        if 'อนุมัติ' in filename or 'ศึกษาต่อ' in filename or 'หลักสูตร' in filename or 'พิจารณา' in filename: return base + 10
        if 'ประวัติ' in filename or 'information' in filename or 'consent' in filename or 'release' in filename or 'ยินยอม' in filename: return base + 20
        if 'ตรวจสุขภาพ' in filename or 'จิตวิทยา' in filename: return base + 30
        if 'สัญญา' in filename or 'ค้ำประกัน' in filename or 'รับรองผู้ค้ำ' in filename: return base + 40
        if 'วีซ่า' in filename or 'visa' in filename or 'เดินทาง' in filename or 'รับรอง' in filename: return base + 50
        if 'เบิก' in filename or 'รับเงิน' in filename or 'จ่าย' in filename: return base + 60
        return base + 90
    elif phase == 'ระหว่างศึกษา':
        base = 200
        if 'รายงานตัว' in filename or 'กลับเข้า' in filename: return base + 10
        if 'แผน' in filename or 'โครงร่าง' in filename: return base + 20
        if 'ความก้าวหน้า' in filename or 'ผลศึกษา' in filename or 'uis 2' in filename or 'แบบรายงาน' in filename: return base + 30
        if 'ปรับเปลี่ยน' in filename or 'คำขอ' in filename or 'พัก' in filename: return base + 40
        if 'อนุมัติ' in filename or 'ตอบรับ' in filename or 'ทับตำแหน่ง' in filename or 'งบ' in filename: return base + 50
        return base + 90
    elif phase == 'สำเร็จการศึกษา':
        base = 300
        if 'สิ้นสุด' in filename or 'สำเร็จ' in filename or 'uis_3' in filename: return base + 10
        if 'รายงานตัว' in filename or 'ส่งตัว' in filename or 'กลับจาก' in filename: return base + 20
        if 'จำนง' in filename or 'รับราชการ' in filename: return base + 30
        if 'จัดสรร' in filename or 'บรรจุ' in filename or 'ปฏิบัติราชการ' in filename or 'ตอบรับ' in filename: return base + 40
        if 'คำนวณ' in filename: return base + 50
        return base + 90
    return 999

df['ลำดับการเกิด (Timeline)'] = df.apply(get_timeline_order, axis=1)

grouped = df.groupby(['ชื่อไฟล์ (เอกสาร)', 'ระยะที่ใช้', 'ประเภท', 'รายละเอียด', 'หมายเหตุ / ข้อสังเกต', 'ลำดับการเกิด (Timeline)']).agg({
    'กลุ่มงานที่รับผิดชอบ': lambda x: ', '.join(sorted(set(x)))
}).reset_index()

grouped = grouped.sort_values('ลำดับการเกิด (Timeline)')
grouped['ลำดับการเกิด (Timeline)'] = range(1, len(grouped) + 1)

counters = {}
def generate_id(phase, type_str):
    p = phase_codes.get(phase, 'GEN')
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

excel_path = os.path.join(base_dir, 'Summary_All_Forms.xlsx')
with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
    grouped.to_excel(writer, index=False, sheet_name='Form Inventory')
    worksheet = writer.sheets['Form Inventory']
    worksheet.column_dimensions['A'].width = 15
    worksheet.column_dimensions['B'].width = 15
    worksheet.column_dimensions['C'].width = 50
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
