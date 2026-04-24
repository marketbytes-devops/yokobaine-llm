import os
import re

src_dir = r"d:\MarketBytes\web-works\yokobaine-llm\frontend\src"

def fix_quotes(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # We are looking for something like:
    # `${config.API_BASE_URL}/v1/school";
    # `${config.API_BASE_URL}/v1/school';
    # Or similarly constructed strings that start with a backtick and end with " or '
    
    # Regex explanation: match backtick, then ${config.API_BASE_URL}, then any characters EXCEPT quotes/backticks/newlines
    # up to a ending double or single quote.
    # We then replace the ending double/single quote with a backtick.
    
    # Let's be slightly more robust. Match backtick, then anything inside, ending with single or double quote.
    # Since there are multiple similar issues caused by `${config.API_BASE_URL}
    
    pattern = r'(\`\$\{config\.API_BASE_URL\}[^"\n\r]*?)["\']'
    content = re.sub(pattern, r'\1`', content)

    # What about SchoolProfile.jsx where it says `${API_BASE}/profile`); but expected wait..
    # Let's check API_BASE. It might be: const API_BASE = `${config.API_BASE_URL}";
    pattern2 = r'(\`\$\{config\.API_BASE_URL\}[^"\n\r\']*)["\']'
    content = re.sub(pattern2, r'\1`', content)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {file_path}")

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.js', '.jsx', '.ts', '.tsx')):
            fix_quotes(os.path.join(root, f))
