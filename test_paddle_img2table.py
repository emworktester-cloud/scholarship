import os
import pandas as pd
from img2table.ocr import EasyOCR
from img2table.document import PDF

def test():
    pdf_path = r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1\0167.pdf"
    
    print("Initializing EasyOCR model for Thai/English...")
    ocr = EasyOCR(lang=["th", "en"])
    
    print("Initializing PDF...")
    doc = PDF(pdf_path, pages=[1]) # Page 2
    
    print("Extracting tables using PaddleOCR...")
    extracted_tables = doc.extract_tables(ocr=ocr, implicit_rows=True)
    
    tables_on_page = extracted_tables.get(1, [])
    print(f"Found {len(tables_on_page)} tables.")
    
    if tables_on_page:
        for idx, table in enumerate(tables_on_page):
            print(f"Table {idx}: df shape = {table.df.shape}")
            print("----- Sample data -----")
            print(table.df.head(15))

if __name__ == "__main__":
    test()
