const DEFAULTS = {
  enabled: true,
  logic: 'OR',
  rules: [
    { id: 'r1', pattern: '₹', field: 'compensation', negate: false },
    { id: 'r2', pattern: 'india', field: 'location', negate: false }
  ]
};

let settings = structuredClone(DEFAULTS);
let statusTimer = null;

function uid() {
  return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

function showStatus(msg) {
  const el = document.getElementById('status');
  el.textContent = msg;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { el.textContent = ''; }, 1500);
}

function persist() {
  chrome.storage.local.set({ settings }, () => showStatus('Saved'));
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderRules() {
  const container = document.getElementById('rules');
  container.innerHTML = '';

  for (const rule of settings.rules) {
    const div = document.createElement('div');
    div.className = 'rule';
    div.innerHTML = `
      <label class="not-badge" title="Hide if this rule does NOT match">
        <input type="checkbox" class="negate" ${rule.negate ? 'checked' : ''}> NOT
      </label>
      <input type="text" class="pattern" value="${escapeHtml(rule.pattern)}" placeholder="e.g. ₹ or India">
      <select class="field">
        <option value="compensation" ${rule.field === 'compensation' ? 'selected' : ''}>Comp.</option>
        <option value="location"     ${rule.field === 'location'     ? 'selected' : ''}>Location</option>
        <option value="anywhere"     ${rule.field === 'anywhere'     ? 'selected' : ''}>Anywhere</option>
      </select>
      <button class="delete-btn" title="Remove">&times;</button>
    `;

    div.querySelector('.negate').addEventListener('change', e => {
      rule.negate = e.target.checked;
      persist();
    });
    div.querySelector('.pattern').addEventListener('input', e => {
      rule.pattern = e.target.value;
      persist();
    });
    div.querySelector('.field').addEventListener('change', e => {
      rule.field = e.target.value;
      persist();
    });
    div.querySelector('.delete-btn').addEventListener('click', () => {
      settings.rules = settings.rules.filter(r => r.id !== rule.id);
      renderRules();
      persist();
    });

    container.appendChild(div);
  }
}

function syncDisabledState() {
  document.body.classList.toggle('disabled', !settings.enabled);
}

// Boot
chrome.storage.local.get('settings', data => {
  if (data.settings) settings = data.settings;
  else chrome.storage.local.set({ settings });

  document.getElementById('enabled').checked = settings.enabled;
  document.getElementById('logic').value = settings.logic;
  syncDisabledState();
  renderRules();
});

document.getElementById('enabled').addEventListener('change', e => {
  settings.enabled = e.target.checked;
  syncDisabledState();
  persist();
});

document.getElementById('logic').addEventListener('change', e => {
  settings.logic = e.target.value;
  persist();
});

document.getElementById('add-btn').addEventListener('click', () => {
  settings.rules.push({ id: uid(), pattern: '', field: 'compensation', negate: false });
  renderRules();
  persist();
});
