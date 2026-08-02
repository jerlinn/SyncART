# Critical CSS for index.html

index.html inlines above-the-fold CSS in a `<style>` block and loads the full
styles.css asynchronously (`media="print"` + onload swap, `<noscript>` fallback).

To regenerate after changing styles.src.css:

```bash
# deps (once): npm i playwright-webkit && npx playwright-webkit install webkit
npx --yes serve -l 8080 .                     # serve repo root
node tools/critical-css/extract.js critical.css
npx --yes csso-cli --no-restructure critical.css -o critical.min.css
# paste critical.min.css into the <style> block in index.html <head>
node tools/critical-css/verify.js             # must report diffs<=1 (main height only)
```

Notes learned the hard way:
- Rules must keep ORIGINAL stylesheet order (cascade), including duplicate rules —
  dedup by sheet index, never by rule text (!important duplicates decide winners).
- Minify the critical block with csso --no-restructure only.
- Zero-size (display:none) elements still need their hiding rules (.lw2-notice).
