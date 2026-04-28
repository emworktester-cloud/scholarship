import cv2
import numpy as np
import pytesseract
from pdf2image import convert_from_path
import pandas as pd
import os
import glob
import re

# Set Tesseract path and Tessdata path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
TESSDATA_PREFIX = r'C:\Users\USER\.gemini\antigravity\scratch\tessdata'

def extract_table_from_image(img_path):
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)[1]

    # Detect horizontal lines
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
    detect_horizontal = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)
    cnts_h = cv2.findContours(detect_horizontal, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts_h = cnts_h[0] if len(cnts_h) == 2 else cnts_h[1]
    
    # Detect vertical lines
    vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
    detect_vertical = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, vertical_kernel, iterations=2)
    cnts_v = cv2.findContours(detect_vertical, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts_v = cnts_v[0] if len(cnts_v) == 2 else cnts_v[1]

    # Find table mask
    table_mask = cv2.add(detect_horizontal, detect_vertical)
    
    # Find cells
    cnts = cv2.findContours(table_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    
    bounding_boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 20 < w < 2000 and 15 < h < 100:  # Adjust heuristics for cell sizes
            bounding_boxes.append((x, y, w, h))
            
    # Sort boxes top to bottom, then left to right
    bounding_boxes.sort(key=lambda b: (b[1] // 20, b[0]))
    
    # Needs complex grouping into rows and columns here.
    # For a quick prototype, just return the number of cells.
    return len(bounding_boxes)

if __name__ == "__main__":
    print("Test extraction script ready.")
