import os
import glob
import re
import pandas as pd
from img2table.ocr import EasyOCR
from img2table.document import PDF

def clean_amount(text):
    if not isinstance(text, str):
        return text
    # Keep only digits and decimal points
    cleaned = re.sub(r'[^\d.]', '', text)
    if not cleaned:
        return '0.00'
    return cleaned

def is_valid_tax_id(text):
    if not isinstance(text, str):
        return False
    digits = re.sub(r'\D', '', text)
    return len(digits) == 13

def process_year_folder(folder_path, output_excel, ocr):
    pdf_files = glob.glob(os.path.join(folder_path, "*.pdf"))
    if not pdf_files:
        print(f"No PDF files found in {folder_path}!")
        return

    months_th = {
        "01": "มกราคม", "02": "กุมภาพันธ์", "03": "มีนาคม", "04": "เมษายน",
        "05": "พฤษภาคม", "06": "มิถุนายน", "07": "กรกฎาคม", "08": "สิงหาคม",
        "09": "กันยายน", "10": "ตุลาคม", "11": "พฤศจิกายน", "12": "ธันวาคม"
    }

    print(f"\n--- Processing Folder: {folder_path} ---")
    
    with pd.ExcelWriter(output_excel, engine="xlsxwriter") as writer:
        for pdf_path in sorted(pdf_files):
            filename = os.path.basename(pdf_path)
            month_code = filename[:2]
            month_name = months_th.get(month_code, "เดือนไม่ทราบ")
            sheet_name = month_name
            
            print(f"File: {filename} -> Tab: {sheet_name}")
            
            try:
                # PDF processing: Check if file needs to be initialized
                doc = PDF(pdf_path)
                # Extract tables with PaddleOCR
                extracted_tabs = doc.extract_tables(ocr=ocr, implicit_rows=True)
                
                all_extracted_data = []
                
                # Iterate through pages
                for page_idx, tables in extracted_tabs.items():
                    if page_idx == 0:
                        continue # Skip page 1 (Main PND.1 form)
                    
                    for table in tables:
                        df = table.df
                        if df.shape[1] < 7:
                            continue # Ignore sub-tables or irrelevant lines
                            
                        # Extract data row by row
                        for _, row in df.iterrows():
                            str_row = [str(x).replace('\n', ' ').strip() for x in row.values]
                            
                            # A simple heuristic to check if row has data (at least "ลำดับที่" or "เลขประสักตัว")
                            # In PND 1 attached form, second column is usually 13-digit ID
                            if len(str_row) >= 7:
                                all_extracted_data.append(str_row)

                # Format the DataFrame to our expected columns
                # We need exactly 9 target columns
                target_cols = [
                    "เดือน", "ลำดับที่", "เลขประจำตัวผู้เสียภาษีอากร", 
                    "ชื่อผู้มีเงินได้", "ชื่อสกุล", "วัน เดือน ปี ที่จ่าย", 
                    "จำนวนเงินได้ที่จ่ายในครั้งนี้", "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้", "เงื่อนไข"
                ]
                
                if all_extracted_data:
                    # Let's map data naively assuming order matches PND.1 standards:
                    # [0]: ลำดับ | [1]: เลขผู้เสีย | [2]: ชื่อ | [3]: นามสกุล | [4]: วันที่ | [5]: เงินได้ | [6]: ภาษี | [7]: เงื่อนไข
                    # Since some OCR may merge Name/Surname, we adjust if lengths mismatch
                    
                    clean_rows = []
                    for r in all_extracted_data:
                        # Skip header rows (non-numeric first/second column)
                        if not any(char.isdigit() for char in r[0]) and not is_valid_tax_id(r[1]):
                            continue
                        
                        # Pad row to 8 columns if missing
                        r = r + [''] * (8 - len(r))
                        
                        # Clean amounts
                        amt_income = clean_amount(r[-3] if len(r) >= 8 else '')
                        amt_tax = clean_amount(r[-2] if len(r) >= 8 else '')
                        
                        clean_rows.append({
                            "เดือน": month_name,
                            "ลำดับที่": r[0] if len(r)>0 else '',
                            "เลขประจำตัวผู้เสียภาษีอากร": r[1] if len(r)>1 else '',
                            "ชื่อผู้มีเงินได้": r[2] if len(r)>2 else '',
                            "ชื่อสกุล": r[3] if len(r)>3 else '',
                            "วัน เดือน ปี ที่จ่าย": r[-4] if len(r)>=4 else '',
                            "จำนวนเงินได้ที่จ่ายในครั้งนี้": amt_income,
                            "จำนวนเงินภาษีที่หักและนำส่งในครั้งนี้": amt_tax,
                            "เงื่อนไข": r[-1] if len(r)>0 else ''
                        })
                        
                    final_df = pd.DataFrame(clean_rows, columns=target_cols)
                    final_df.to_excel(writer, sheet_name=sheet_name[:31], index=False)
                    print(f"  -> Success: Extracted {len(final_df)} data rows.")
                else:
                    print(f"  !!! Warning: No valid tables found for {filename}")
                    pd.DataFrame([["No data found or OCR failed"]], columns=["Error"]).to_excel(writer, sheet_name=sheet_name[:31], index=False)
                    
            except Exception as e:
                print(f"  [ERROR] {filename}: {str(e)}")
                pd.DataFrame([[f"Processing error: {str(e)}"]], columns=["Error"]).to_excel(writer, sheet_name=sheet_name[:31], index=False)

if __name__ == "__main__":
    print("Loading EasyOCR model (Thai/English)...")
    ocr = EasyOCR(lang=["th", "en"])
    print("Model loaded.")
    
    process_year_folder(r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1", r"C:\Users\USER\Downloads\PND1_2567.xlsx", ocr)
    process_year_folder(r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1", r"C:\Users\USER\Downloads\PND1_2568.xlsx", ocr)
    print("All extraction finished.")
