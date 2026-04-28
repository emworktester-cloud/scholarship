import easyocr
import cv2
from pdf2image import convert_from_path

def test():
    pdf_path = r"C:\Users\USER\Downloads\2567 ภ.ง.ด.1\0167.pdf"
    print("Converting page 2 to image...")
    # Wait, pdf2image requires poppler but poppler failed to install!
    # I should use PyMuPDF to get the image!
    import fitz
    
    doc = fitz.open(pdf_path)
    page = doc[1]  # Page 2
    pix = page.get_pixmap(dpi=300)
    import numpy as np
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
    if pix.n == 4:
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
    elif pix.n == 1:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
        
    cv2.imwrite("page2.jpg", img)
    
    print("Running EasyOCR directly...")
    reader = easyocr.Reader(['th', 'en'])
    results = reader.readtext("page2.jpg")
    
    print(f"Detected {len(results)} texts.")
    for bbox, text, conf in results[:20]:
        print(f"Conf: {conf:.2f} | Text: {text}")

if __name__ == "__main__":
    test()
