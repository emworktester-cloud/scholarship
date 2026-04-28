import pandas as pd
import os

files = [
    r"C:\Users\USER\Downloads\PND1_2568_Result.xlsx",
    r"C:\Users\USER\Downloads\PND1_2567_Result.xlsx"
]

for f in files:
    if not os.path.exists(f): continue
    out_f = f.replace(".xlsx", "_No_Names.xlsx")
    
    # Read all sheets
    xls = pd.ExcelFile(f)
    with pd.ExcelWriter(out_f, engine='xlsxwriter') as writer:
        for sheet_name in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet_name)
            if "ชื่อ" in df.columns: df["ชื่อ"] = ""
            if "ชื่อสกุล" in df.columns: df["ชื่อสกุล"] = ""
            if "คำนำหน้า" in df.columns: df["คำนำหน้า"] = ""
            df.to_excel(writer, sheet_name=sheet_name, index=False)
            
    print(f"Created {out_f}")
