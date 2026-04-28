import fitz

def check_pdf(pdf_path):
    print(f"Checking {pdf_path} with PyMuPDF...")
    try:
        doc = fitz.open(pdf_path)
        print(f"Total pages: {len(doc)}")
        page_2 = doc[1]
        text = page_2.get_text("text")
        if text.strip():
            print("Text found on page 2:")
            print(text[:500])
        else:
            print("No text found on page 2.")
            
            # Check for images
            images = page_2.get_images()
            print(f"Found {len(images)} images on page 2.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_pdf(r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1\0167.pdf")
