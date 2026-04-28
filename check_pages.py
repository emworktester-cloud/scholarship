import fitz, os, glob

for folder in [r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1", r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1"]:
    print(f"\n=== {os.path.basename(folder)} ===")
    for f in sorted(glob.glob(os.path.join(folder, "*.pdf"))):
        doc = fitz.open(f)
        print(f"  {os.path.basename(f)}: {len(doc)} pages")
        doc.close()
