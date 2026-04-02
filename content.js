// Wellfound India Filter — content script

function isIndianBlock(blockEl) {
  // Signal 1: Indian Rupee symbol in compensation
  const compensations = blockEl.querySelectorAll('.styles_compensation__3JnvU');
  for (const el of compensations) {
    if (el.textContent.includes('₹')) return true;
  }

  // Signal 2: "India" as a whole word in location tags
  const locations = blockEl.querySelectorAll('.styles_location__O9Z62');
  for (const el of locations) {
    if (/\bindia\b/i.test(el.textContent)) return true;
  }

  return false;
}

function filterBlocks() {
  const blocks = document.querySelectorAll('[data-test="StartupResult"]');
  for (const block of blocks) {
    if (isIndianBlock(block)) {
      block.style.display = 'none';
    }
  }
}
