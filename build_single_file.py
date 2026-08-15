import os
import re
import zipfile

ROOT = r"d:\NEXU_WEBSITE DIV"

def build():
    print("[*] Building Single-File Bundles...")
    
    # 1. Read index.html
    with open(os.path.join(ROOT, "index.html"), "r", encoding="utf-8") as f:
        html = f.read()

    # 2. Read styles.css
    with open(os.path.join(ROOT, "styles.css"), "r", encoding="utf-8") as f:
        css = f.read()

    # 3. Read and assemble JS modules
    js_files = [
        "bg-slideshow.js",
        "bg-canvas.js",
        "scroll-video.js",
        "desktop-fx.js",
        "main.js"
    ]
    
    combined_js = ""
    for fname in js_files:
        fpath = os.path.join(ROOT, "js", fname)
        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                code = f.read()
                # Remove import statements between local files
                code = re.sub(r'import\s+.*?\s+from\s+[\'"]\./.*?[\'"];?', '', code)
                # Remove export keywords
                code = re.sub(r'export\s+(function|const|let|var|class)\s+', r'\1 ', code)
                combined_js += f"\n/* --- Module: {fname} --- */\n" + code

    # Replace stylesheet link with inline <style>
    style_tag = f"<style>\n{css}\n</style>"
    html_single = re.sub(
        r'<link\s+rel=["\']stylesheet["\'].*?>',
        lambda m: style_tag,
        html,
        flags=re.IGNORECASE
    )

    # Replace script tag with inline <script type="module">
    script_tag = f"<script type=\"module\">\n{combined_js}\n</script>"
    html_single = re.sub(
        r'<script\s+type=["\']module["\']\s+src=["\']js/main\.js.*?["\']></script>',
        lambda m: script_tag,
        html_single,
        flags=re.IGNORECASE
    )

    # Write portfolio_standalone.html
    out_html = os.path.join(ROOT, "portfolio_standalone.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html_single)
    print(f"[OK] Generated standalone single HTML file: {out_html} ({len(html_single):,} bytes)")

    # 4. Create nxu-portfolio-dist.zip (Single-File Complete Portable Distribution Archive)
    zip_path = os.path.join(ROOT, "nxu-portfolio-dist.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(ROOT):
            if ".git" in root or "node_modules" in root or ".gemini" in root:
                continue
            for file in files:
                if file.endswith(".zip"):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, ROOT)
                zipf.write(file_path, arcname)
    
    print(f"[OK] Generated single-file portable archive: {zip_path} ({os.path.getsize(zip_path):,} bytes)")

if __name__ == "__main__":
    build()
