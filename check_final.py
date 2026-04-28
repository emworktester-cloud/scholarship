import pandas as pd
f = r"C:\Users\USER\Downloads\PND1_2568_Result_Final.xlsx"
df = pd.read_excel(f, "มกราคม")
print(df[["เลขประจำตัวผู้เสียภาษีอากร", "คำนำหน้า", "ชื่อ", "ชื่อสกุล"]].head(5))
