# Wellfound Filter

A Chrome extension that hides job listings on Wellfound based on customizable filter rules.

## Features

- Hide jobs by compensation (e.g., filter out jobs paying in specific currencies)
- Hide jobs by location (e.g., filter out jobs in specific countries)
- OR/AND logic — hide if ANY rule matches, or only if ALL rules match
- NOT negation — invert any rule to show jobs that DON'T match
- Real-time filtering as you scroll (MutationObserver for SPA support)
- Settings persist across sessions

## Installation

1. Download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the extension folder

## Usage

1. Navigate to `https://wellfound.com/jobs`
2. Click the extension icon in the Chrome toolbar
3. Toggle the filter on/off
4. Add rules:
   - **Pattern**: Text to match (e.g., `₹`, `India`, `$`)
   - **Field**: Compensation, Location, or Anywhere
   - **NOT**: Check to show jobs that DON'T match

## Development

This is vanilla JavaScript with no build step. Edit files directly.

### Files

- `manifest.json` — Extension manifest (Manifest V3)
- `content.js` — Content script (runs on wellfound.com/jobs)
- `popup.html` / `popup.js` — Extension popup UI

### Reload

After editing files, click the refresh icon on the extension card in `chrome://extensions/`.

## License

MIT