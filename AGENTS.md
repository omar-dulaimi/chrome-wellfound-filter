# Wellfound Filter — Agent Notes

## Extension Loading

- Load unpacked: Chrome → `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select project folder
- Reload: Click the refresh icon on the extension card after editing files

## Critical URL Pattern

**Manifest must use `https://wellfound.com/*` NOT `https://www.wellfound.com/*`.**
The www version silently fails to inject with no error.

## Fragile Selectors

Two selectors in `content.js` use hashed CSS Modules classes that break on Wellfound redeploys:

- **Compensation**: `.styles_compensation__3JnvU`
- **Location**: `.styles_location__O9Z62`

If filtering stops working, inspect the DOM and update these class names in `content.js:22` and `content.js:24`.

## Testing the Extension

1. Load unpacked in Chrome
2. Navigate to `https://wellfound.com/jobs`
3. Verify companies with ₹ in compensation or "India" in location are hidden
4. Scroll — new results should be filtered automatically (MutationObserver)

## No Build Step

This is vanilla JS with no build system. Edit files directly.