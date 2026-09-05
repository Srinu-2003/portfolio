// ============================================================
// Documents lock screen
//
// IMPORTANT: this checks a SHA-256 hash of the password client-side.
// That keeps the plain password out of the page source, but it is
// NOT real security — anyone who opens dev tools can see the hash
// and, on most static hosts, anyone with the direct file URL can
// open a "private" file without ever seeing this screen. Use this
// to keep casual visitors and search engines out, not for anything
// truly confidential. See README.md for stronger options.
//
// Default password is:  changeme
// Change it with generate-hash.html before you publish this site.
// ============================================================

(function documentsLock(){
  const form   = document.getElementById('lockForm');
  if (!form) return; // not on this page

  const input       = document.getElementById('pw');
  const errorEl     = document.getElementById('lockError');
  const lockScreen  = document.getElementById('lockScreen');
  const docPanel    = document.getElementById('docPanel');
  const lockAgainBtn= document.getElementById('lockAgain');

  // SHA-256 of "changeme" — replace this with your own hash from
  // generate-hash.html, then update PASSWORD_HASH below.
  const PASSWORD_HASH = '0b7a805b54d7e9a5c61f5e4cf7bfae5ddc1ff9642d5c969a3893ea0af53e05b1';

  const SESSION_KEY = 'srinivas-docs-unlocked';

  async function sha256(text){
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function show(unlocked){
    lockScreen.classList.toggle('doc-hidden', unlocked);
    docPanel.classList.toggle('doc-hidden', !unlocked);
  }

  // stay unlocked for this browser tab only (cleared on tab close)
  if (sessionStorage.getItem(SESSION_KEY) === '1') show(true);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    if (!crypto.subtle){
      errorEl.textContent = 'This browser can\u2019t verify the password securely (no Web Crypto support).';
      return;
    }

    const hash = await sha256(input.value);
    if (hash === PASSWORD_HASH){
      sessionStorage.setItem(SESSION_KEY, '1');
      input.value = '';
      show(true);
    } else {
      errorEl.textContent = 'Wrong password.';
      input.value = '';
      input.focus();
    }
  });

  if (lockAgainBtn){
    lockAgainBtn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      show(false);
    });
  }
})();

// -------------------- add-a-document (client-side only) --------------------
// Rows added here are saved with localStorage, so they're remembered on this
// browser between visits — but they exist only in this browser. Anyone else
// unlocking the page on a different device won't see them. This never uploads
// or moves a file; it just creates the row + link. The real PDF still has to
// be placed in assets/private/ by hand, with the matching file name.
(function customDocs(){
  const form   = document.getElementById('addDocForm');
  const list   = document.getElementById('docListCustom');
  if (!form || !list) return;

  const STORAGE_KEY = 'srinivas-docs-custom-rows';

  function load(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function save(rows){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); }
    catch (e) { /* storage unavailable — rows just won't persist */ }
  }

  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render(){
    const rows = load();
    list.classList.toggle('doc-hidden', rows.length === 0);
    list.innerHTML = rows.map((row, i) => `
      <div class="doc-row">
        <div class="meta">
          <h3>${escapeHtml(row.title)}</h3>
          <p class="filemeta">PDF · added on this browser</p>
        </div>
        <div style="display:flex; align-items:center;">
          <a class="dl" href="assets/private/${escapeHtml(row.file)}" download>Download</a>
          <button type="button" class="remove-row" data-idx="${i}" aria-label="Remove ${escapeHtml(row.title)}">Remove</button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.remove-row').forEach(btn => {
      btn.addEventListener('click', () => {
        const rows = load();
        rows.splice(Number(btn.dataset.idx), 1);
        save(rows);
        render();
      });
    });
  }

  render();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('docTitle').value.trim();
    let file  = document.getElementById('docFile').value.trim();
    if (!title || !file) return;

    // keep it to a plain file name — no folders, no going up a directory
    file = file.replace(/^\/+/, '').split(/[\\/]/).pop();

    const rows = load();
    rows.push({ title, file });
    save(rows);
    render();
    form.reset();
  });
})();
