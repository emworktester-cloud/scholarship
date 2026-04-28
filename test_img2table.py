import os
import pytesseract
from img2table.ocr import TesseractOCR
from img2table.document import PDF
import pandas as pd

pytesseract.pytesseract.tesseract_cmd = r'C:\Users\USER\.gemini\antigravity\scratch\Tesseract-OCR\tesseract.exe'
TESSDATA_PREFIX = r'C:\Users\USER\.gemini\antigravity\scratch\Tesseract-OCR\tessdata'

# Ensure the environment variable is set for tesseract
os.environ["TESSDATA_PREFIX"] = TESSDATA_PREFIX
os.environ["PATH"] += os.pathsep + r"C:\Users\USER\.gemini\antigravity\scratch\Tesseract-OCR"

def test():
    pdf_path = r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1\0167.pdf"
    print(f"Testing on {pdf_path}")
    
    # Initialize OCR
    ocr = TesseractOCR(n_threads=1, lang="tha+eng")
    
    # Initialize Document with pages 2. (0-indexed -> pages=[1, 2])
    print("Initializing PDF...")
    doc = PDF(pdf_path, pages=[1]) # Page 2 only
    
    # Extract tables
    print("Extracting tables...")
    extracted_tables = doc.extract_tables(ocr=ocr, implicit_rows=False)
    
    print(f"Found on Page 2: {len(extracted_tables.get(1, []))} tables.")
    
    tables_on_page = extracted_tables.get(1, [])
    if tables_on_page:
        for idx, table in enumerate(tables_on_page):
            print(f"Table {idx}: df shape = {table.df.shape}")
            print("Headers (first row):")
            print(table.df.iloc[0].values)
            print("Sample data:")
            print(table.df.head(3))
            
if __name__ == "__main__":
    test()
