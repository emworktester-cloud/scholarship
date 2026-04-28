import urllib.request
import os
import subprocess

def install():
    url = "https://digi.bib.uni-mannheim.de/tesseract/tesseract-ocr-w64-setup-5.3.3.20231005.exe"
    exe_path = r"C:\Users\USER\.gemini\antigravity\scratch\tesseract-setup.exe"
    target_dir = r"C:\Users\USER\.gemini\antigravity\scratch\Tesseract-OCR"
    
    print("Downloading Tesseract installer...")
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'}
    )
    with urllib.request.urlopen(req) as response, open(exe_path, 'wb') as out_file:
        out_file.write(response.read())
    print("Downloaded successfully.")
    
    print("Installing Tesseract locally...")
    # Run the setup silently and install in the specific directory without requiring Admin config
    cmd = f'"{exe_path}" /VERYSILENT /CURRENTUSER /DIR="{target_dir}"'
    subprocess.run(cmd, shell=True, check=True)
    print(f"Installed at {target_dir}")
    
if __name__ == "__main__":
    install()
