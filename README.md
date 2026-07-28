# Wellfound Filter

A Chrome extension that filters job listings on [Wellfound](https://wellfound.com/jobs) based on configurable pattern rules.

## Default Rules

When first installed, the extension hides jobs matching:
- **₹** in compensation field (Indian Rupee)
- **india** in location field (case-insensitive, whole word)

## Features

- **Pattern matching**: Filter by any text pattern (currency symbols, country names, keywords)
- **Field targeting**: Match against compensation, location, or anywhere in the job block
- **OR/AND logic**: Hide if ANY rule matches, or only if ALL rules match
- **NOT toggle**: Invert any rule to show jobs that DON'T match
- **SPA support**: Uses MutationObserver to filter jobs as they're loaded on scroll
- **Persistent settings**: Rules saved to Chrome local storage

## Installation

1. Download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top-right)
4. Click **Load unpacked** and select the extension folder

## Usage

1. Visit `https://wellfound.com/jobs`
2. Click the extension icon in the toolbar
3. Configure rules in the popup:
   - **Pattern**: Text to match (e.g., `₹`, `India`, `£`, `$`)
   - **Field**: Comp. (compensation), Location, or Anywhere
   - **NOT**: Check to show jobs that DON'T match this rule
4. Use the toggle to enable/disable filtering

## How It Works

The content script (`content.js`) runs on `https://wellfound.com/jobs*` and:
1. Loads settings from `chrome.storage.local`
2. Finds job blocks using `[data-test="StartupResult"]` selector
3. Checks compensation via `.styles_compensation__*` and location via `.styles_location__*` classes
4. Hides matching blocks with `display: none`
5. Uses MutationObserver to filter new jobs as they're lazy-loaded

Note: The CSS class selectors (`.styles_compensation__*`, `.styles_location__*`) are hashed by Wellfound and may change on redeploys. If filtering stops working, inspect the page to find updated selectors.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (Manifest V3) |
| `content.js` | Content script injected on wellfound.com/jobs |
| `popup.html` | Extension popup UI |
| `popup.js` | Popup JavaScript |
| `icon.svg` | Extension icon |

## Reload

After editing files, refresh the extension at `chrome://extensions/`.

## License

MIT