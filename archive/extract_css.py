#!/usr/bin/env python3
"""
Extract CSS from index.html to css/styles.css
"""

# Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find CSS section
start_marker = '    <style>'
end_marker = '    </style>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("ERROR: Could not find <style> tags")
    exit(1)

# Extract CSS (skip the <style> tag itself, keep content)
css_content = content[start_idx + len(start_marker):end_idx]

# Write to css/styles.css
with open('css/styles.css', 'w', encoding='utf-8') as f:
    f.write(css_content.strip())

print(f"✅ Extracted {len(css_content)} characters of CSS to css/styles.css")
