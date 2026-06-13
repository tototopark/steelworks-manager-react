import os

sitepro_dir = r"f:\pe\public_html\sitepro"
keywords = ["chart", "google", "visual", "timesheet", "punch", "draw"]

found_files = {}

for filename in os.listdir(sitepro_dir):
    if filename.endswith(".php") and "save" not in filename.lower():
        filepath = os.path.join(sitepro_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                matches = []
                for kw in keywords:
                    if kw in content.lower():
                        matches.append(kw)
                if matches:
                    found_files[filename] = matches
        except Exception as e:
            pass

print("Search results:")
for k, v in sorted(found_files.items()):
    print(f"File {k}: contains {v}")
