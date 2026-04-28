import pdfplumber
import sys

def check_pdf(pdf_path):
    print(f"Checking {pdf_path}...")
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"Total pages: {len(pdf.pages)}")
            page_2 = pdf.pages[1]
            text = page_2.extract_text()
            if text:
                print("Text found on page 2:")
                print(text[:500])
            else:
                print("No text found on page 2. It might be a scanned image.")
            
            tables = page_2.extract_tables()
            if tables:
                print(f"Found {len(tables)} tables on page 2.")
            else:
                print("No tables found using PDFplumber on page 2.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_pdf(r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1\0167.pdf")
    check_pdf(r"C:\Users\USER\Downloads\2568 ภ.ง.ด.1\0168.pdf")
