import os
import re

base_path = r'd:\MarketBytes\web-works\yokobaine-llm\frontend\src'

def fix_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jsx', '.js', '.tsx', '.ts')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Find patterns like: `${config.API_BASE_URL}/auth/users";
                    # and replace with: `${config.API_BASE_URL}/auth/users`;
                    
                    # Also fix patterns like: `${config.API_BASE_URL}/v1/school",
                    # -> `${config.API_BASE_URL}/v1/school`,
                    
                    new_content = re.sub(r'(`\$\{config\.API_BASE_URL\}[^"`\']*)["\']', r'\1`', content)
                    
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed string interpolation in {os.path.relpath(file_path, base_path)}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

fix_files(base_path)
