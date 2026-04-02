// Wellfound Filter — content script

const DEFAULTS = {
  enabled: true,
  logic: 'OR',
  rules: [
    { id: 'r1', pattern: '₹', field: 'compensation', negate: false },
    { id: 'r2', pattern: 'india', field: 'location', negate: false }
  ]
};

let currentSettings = DEFAULTS;

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesRule(blockEl, rule) {
  if (!rule.pattern.trim()) return false;
  let els;
  if (rule.field === 'compensation') {
    els = Array.from(blockEl.querySelectorAll('.styles_compensation__3JnvU'));
  } else if (rule.field === 'location') {
    els = Array.from(blockEl.querySelectorAll('.styles_location__O9Z62'));
  } else {
    els = [blockEl];
  }
  const regex = new RegExp(escapeRegex(rule.pattern.trim()), 'i');
  const matched = els.some(el => regex.test(el.textContent));
  return rule.negate ? !matched : matched;
}

function shouldHide(blockEl, { rules, logic }) {
  if (!rules.length) return false;
  return logic === 'AND'
    ? rules.every(r => matchesRule(blockEl, r))
    : rules.some(r => matchesRule(blockEl, r));
}

function resetAll() {
  document.querySelectorAll('[data-test="StartupResult"][data-wf-hidden]').forEach(el => {
    el.style.display = '';
    delete el.dataset.wfHidden;
  });
}

function applyFilter() {
  if (!currentSettings.enabled) {
    resetAll();
    return;
  }
  const blocks = document.querySelectorAll('[data-test="StartupResult"]:not([data-wf-hidden])');
  let count = 0;
  for (const block of blocks) {
    if (shouldHide(block, currentSettings)) {
      block.style.display = 'none';
      block.dataset.wfHidden = '1';
      const name = block.querySelector('h2')?.textContent?.trim() ?? '(unknown)';
      console.log(`[WF Filter] Hidden: ${name}`);
      count++;
    }
  }
  if (count) console.log(`[WF Filter] Hid ${count} block(s) this pass`);
}

console.log('[WF Filter] content script loaded');

chrome.storage.local.get('settings', data => {
  currentSettings = data.settings || DEFAULTS;
  console.log('[WF Filter] settings loaded, enabled:', currentSettings.enabled, 'logic:', currentSettings.logic, 'rules:', currentSettings.rules.length);
  applyFilter();

  const observer = new MutationObserver(applyFilter);
  observer.observe(document.body, { childList: true, subtree: true });
});

chrome.storage.onChanged.addListener(changes => {
  if (!changes.settings) return;
  currentSettings = changes.settings.newValue;
  console.log('[WF Filter] settings updated, re-filtering');
  resetAll();
  applyFilter();
});
