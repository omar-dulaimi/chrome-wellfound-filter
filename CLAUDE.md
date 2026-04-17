# Wellfound Filter — Project Notes

## Match Pattern
The site URL is `https://wellfound.com/jobs` — no `www.` prefix.
Manifest must use `https://wellfound.com/*`, NOT `https://www.wellfound.com/*`.
The `www.` version silently fails to inject with no error.

## Selectors (may break on Wellfound deploys)
- Company block: `[data-test="StartupResult"]` — stable, set by Wellfound's test suite
- Compensation: `.styles_compensation__3JnvU` — hashed CSS Modules class, will change on redeploys
- Location: `.styles_location__O9Z62` — same, hashed, fragile

If filtering stops working after a Wellfound deploy, inspect the DOM and update these two class names in `content.js`.

## Filter logic
Hide a company block if ANY job inside has:
1. `₹` in the compensation element
2. The word `india` (whole word, case-insensitive) in any location element
