/* =====================================================================
   DYNAMIC.JS
   Everything related to editing, saving, and restoring this portfolio:
   - PIN / password security gate for edit mode
   - Edit mode toggling (and what becomes editable when it's on)
   - Profile picture upload (locked behind edit mode)
   - Persistent storage: data.js (permanent, committed source of truth)
     + localStorage (per-browser safety net), with a "Link Data File"
     button that writes edits straight to data.js on disk
   - Project cards: add, edit, delete, and link (Live Preview / GitHub)
     editing
   - "Add Skill" modal
   Depends on script.js loading first (uses showToast + lucide), and
   data.js loading before this file (provides window.SITE_DATA).
   ===================================================================== */

// ===== PIN / PASSWORD SECURITY =====
const CORRECT_PIN = '1234';
let pinEntry = '';
const pinModal = document.getElementById('pinModal');
const pinDots = document.getElementById('pinDots').children;
const pinError = document.getElementById('pinError');

function pinInput(num) {
    if (pinEntry.length >= 4) return;
    pinEntry += num;
    updatePinDots();
    if (pinEntry.length === 4) {
        setTimeout(() => {
            if (pinEntry === CORRECT_PIN) {
                pinModal.style.display = 'none';
                enableEditing();
                showToast('Edit mode unlocked!');
            } else {
                pinError.classList.remove('hidden');
                Array.from(pinDots).forEach(d => { d.classList.add('wrong'); d.classList.remove('filled'); });
                pinModal.querySelector('.glass').classList.add('shake');
                setTimeout(() => pinModal.querySelector('.glass').classList.remove('shake'), 400);
                setTimeout(() => { pinEntry = ''; updatePinDots(); pinError.classList.add('hidden'); Array.from(pinDots).forEach(d => d.classList.remove('wrong')); }, 800);
            }
        }, 200);
    }
}
function pinClear() { pinEntry = pinEntry.slice(0, -1); updatePinDots(); pinError.classList.add('hidden'); }
function updatePinDots() { Array.from(pinDots).forEach((d, i) => { d.classList.toggle('filled', i < pinEntry.length); d.classList.remove('wrong'); }); }

// ===== EDIT MODE =====
// editMode is the single source of truth that every gated feature
// (profile picture, project add/edit/delete, skill add, link editing)
// checks before allowing a change.
let editMode = false;
const editToggle = document.getElementById('editToggle');
const editBtnText = document.getElementById('editBtnText');
const editIcon = document.getElementById('editIcon');

// Re-query fresh every time instead of caching once, so fields added
// later (e.g. new project cards) are picked up too.
function getEditableFields() {
    return document.querySelectorAll('[data-key]');
}

function enableEditing() {
    editMode = true;
    editBtnText.textContent = 'Done';
    editIcon.setAttribute('data-lucide', 'unlock');
    lucide.createIcons();
    editToggle.style.borderColor = 'rgba(var(--theme-primary-rgb),.5)';
    editToggle.style.background = 'rgba(var(--theme-primary-rgb),.08)';
    getEditableFields().forEach(f => { f.contentEditable = 'true'; });
    document.body.classList.add('edit-mode');
}

function disableEditing() {
    editMode = false;
    editBtnText.textContent = 'Edit';
    editIcon.setAttribute('data-lucide', 'lock');
    lucide.createIcons();
    editToggle.style.borderColor = '';
    editToggle.style.background = '';
    getEditableFields().forEach(f => { f.contentEditable = 'false'; });
    document.body.classList.remove('edit-mode');
    saveAllData();
    showToast(dataFileHandle ? 'All changes saved to data.js!' : 'Saved to this browser — click "Link Data File" (or "Download data.js") to make it permanent.');
}

editToggle.addEventListener('click', () => {
    if (!editMode) {
        pinEntry = '';
        updatePinDots();
        pinError.classList.add('hidden');
        pinModal.style.display = 'flex';
    } else {
        disableEditing();
    }
});

// ===== PROFILE PICTURE (locked behind edit mode) =====
const profilePicWrapper = document.querySelector('.profile-pic-wrapper');
const profilePicInput = document.getElementById('profilePicInput');
const profilePic = document.getElementById('profilePic');

profilePicWrapper.addEventListener('click', () => {
    if (!editMode) { showToast('Enter PIN first to change your photo'); return; }
    profilePicInput.click();
});
profilePicInput.addEventListener('change', e => {
    if (!editMode) return; // extra safety net in case change fires some other way
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Image too large! Max 5MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
        profilePic.style.transform = 'scale(.8)'; profilePic.style.opacity = '.5';
        setTimeout(() => { profilePic.src = ev.target.result; profilePic.style.transform = 'scale(1.1)'; profilePic.style.opacity = '1'; setTimeout(() => profilePic.style.transform = 'scale(1)', 200); }, 150);
        saveAllData();
        showToast('Profile picture updated!');
    };
    reader.readAsDataURL(file);
});

// ===== DATA FILE LINKING (writes straight to data.js on disk) =====
// Uses the File System Access API (Chrome / Edge / Brave) to keep a
// live handle to data.js and overwrite it automatically every time
// saveAllData() runs. The handle is remembered in IndexedDB so it
// reconnects automatically next time, as long as the browser still
// grants permission. Browsers without this API (Firefox, Safari,
// mobile) fall back to a manual "Download data.js" button.
const supportsFS = 'showOpenFilePicker' in window;
let dataFileHandle = null;
let fileWriteBusy = false;
let fileWritePending = null;

const IDB_NAME = 'araraPortfolioFS';
const IDB_STORE = 'handles';
function idbOpen() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}
async function idbSet(key, value) {
    try {
        const db = await idbOpen();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(IDB_STORE, 'readwrite');
            tx.objectStore(IDB_STORE).put(value, key);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (e) { console.error('idbSet failed:', e); }
}
async function idbGet(key) {
    try {
        const db = await idbOpen();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(IDB_STORE, 'readonly');
            const req = tx.objectStore(IDB_STORE).get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    } catch (e) { console.error('idbGet failed:', e); return null; }
}

function buildDataJsText(data) {
    const json = JSON.stringify(data, null, 2)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
    return `/* =====================================================================
   DATA.JS — Arara Portfolio persistent content store
   =====================================================================
   This file holds every piece of editable text, link, skill, and
   project on the site. It is the permanent, committed source of truth
   for the portfolio — this is what loads when the page (or the
   GitHub Pages-hosted site) first opens, in any browser, for anyone.

   HOW IT GETS UPDATED
   Open index.html, click "Edit" (PIN: 1234), make your changes, then
   click "Link Data File" once and pick this file (data.js) from your
   project folder. After that, every edit you make auto-saves straight
   into this file on disk. Just commit + push it to GitHub and your
   live site updates.
   If your browser cannot link files directly (e.g. Firefox, Safari,
   mobile), the button becomes "Download data.js" instead — download
   it after editing and replace the old copy in your project folder.

   HAND-EDITING THIS FILE
   You can also edit the values below directly — it is a plain
   JavaScript object. If you do, open the site afterward in a private/
   incognito window (or clear this site's local storage) so your
   browser does not overwrite your hand edits with an older cached
   copy.
   ===================================================================== */
window.SITE_DATA = ${json};
`;
}

function setFileLinkState(state, name) {
    const btn = document.getElementById('fileLinkBtn');
    const text = document.getElementById('fileLinkText');
    if (!btn || !text) return;
    if (state === 'linked') {
        btn.style.borderColor = 'rgba(var(--theme-primary-rgb),.5)';
        btn.style.background = 'rgba(var(--theme-primary-rgb),.08)';
        text.textContent = 'File Linked';
        btn.title = `Auto-saving to ${name || 'data.js'}`;
    } else {
        btn.style.borderColor = '';
        btn.style.background = '';
        text.textContent = supportsFS ? 'Link Data File' : 'Download data.js';
        btn.title = supportsFS
            ? 'Link this page to your data.js file so edits save automatically'
            : 'Download the latest data.js to save your edits permanently';
    }
}

async function writeDataFile(data) {
    if (!dataFileHandle) return;
    if (fileWriteBusy) { fileWritePending = data; return; }
    fileWriteBusy = true;
    try {
        const perm = await dataFileHandle.queryPermission({ mode: 'readwrite' });
        if (perm !== 'granted') {
            dataFileHandle = null;
            setFileLinkState('unlinked');
            showToast('Data file link lost — click "Link Data File" to reconnect.');
            return;
        }
        const writable = await dataFileHandle.createWritable();
        await writable.write(buildDataJsText(data));
        await writable.close();
    } catch (e) {
        console.error('data.js write failed:', e);
        showToast("Couldn't write to data.js — try relinking the file.");
    } finally {
        fileWriteBusy = false;
        if (fileWritePending) {
            const pending = fileWritePending;
            fileWritePending = null;
            writeDataFile(pending);
        }
    }
}

function downloadDataFile() {
    const data = collectAllData();
    const blob = new Blob([buildDataJsText(data)], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    showToast('data.js downloaded — replace the old one in your project folder, then commit & push.');
}

async function connectDataFile() {
    try {
        const [handle] = await window.showOpenFilePicker({
            types: [{ description: 'JavaScript data file', accept: { 'text/javascript': ['.js'] } }],
            excludeAcceptAllOption: false,
            multiple: false
        });
        const perm = await handle.requestPermission({ mode: 'readwrite' });
        if (perm !== 'granted') { showToast('Permission denied — data.js will not auto-save.'); return; }
        dataFileHandle = handle;
        await idbSet('dataFileHandle', handle);
        setFileLinkState('linked', handle.name);
        showToast(`Linked to ${handle.name} — edits now save here automatically.`);
        writeDataFile(collectAllData());
    } catch (e) {
        if (e.name !== 'AbortError') { console.error('connectDataFile failed:', e); showToast('Could not link file.'); }
    }
}

async function initFileLink() {
    setFileLinkState('unlinked');
    if (!supportsFS) return;
    const handle = await idbGet('dataFileHandle');
    if (!handle) return;
    try {
        const perm = await handle.queryPermission({ mode: 'readwrite' });
        if (perm === 'granted') {
            dataFileHandle = handle;
            setFileLinkState('linked', handle.name);
        }
        // if perm is 'prompt', leave unlinked — clicking the button
        // will re-request permission (needs a user gesture).
    } catch (e) {
        // handle is stale (file moved/deleted) — ignore, stays unlinked
    }
}

// Note: the "Link Data File" / "Download data.js" nav button has been
// removed from the UI. The underlying save-to-browser-storage flow still
// runs automatically (see saveAll/collectAllData below) so edits persist
// in this browser; connectDataFile()/downloadDataFile() remain available
// as functions if you want to wire up your own save button later.

// ===== PERSISTENT STORAGE =====
// data.js (window.SITE_DATA) is the permanent, committed source of
// truth. localStorage is a per-browser safety net that also lets the
// page resume mid-edit if the tab is closed before data.js is synced.
// Whichever was saved most recently (by timestamp) wins on load.
const STORAGE_KEY = 'arara_portfolio_data';
const DEFAULT_PROJECT_IDS = ['proj1', 'proj2', 'proj3'];

function collectAllData() {
    const data = {};

    // Any text field marked with data-key (name, bio, skills labels, default project text, etc.)
    document.querySelectorAll('[data-key]').forEach(el => {
        data[el.getAttribute('data-key')] = el.innerHTML;
    });

    // Any link marked with data-link-key (the default projects' Live Preview / GitHub buttons)
    document.querySelectorAll('[data-link-key]').forEach(el => {
        data['link__' + el.getAttribute('data-link-key')] = el.getAttribute('href');
    });

    // Profile picture
    data._profilePic = profilePic.src;

    // Skill bars
    const skills = [];
    document.querySelectorAll('.skill-item').forEach(item => {
        skills.push({ name: item.dataset.skill, level: item.dataset.level });
    });
    data._skills = skills;

    // Tools & Technologies tags
    const tools = [];
    document.querySelectorAll('#toolsList .tool-tag').forEach(tag => {
        tools.push(tag.dataset.tool);
    });
    data._tools = tools;

    // Custom (user-added) project cards — rebuilt from the DOM every save,
    // so add / edit / delete all stay in sync automatically.
    const customProjects = [];
    document.querySelectorAll('.project-card[data-custom="true"]').forEach(card => {
        const titleEl = card.querySelector('[data-role="title"]');
        const descEl = card.querySelector('[data-role="desc"]');
        const links = card.querySelectorAll('a');
        customProjects.push({
            title: titleEl ? titleEl.innerHTML : 'New Project',
            desc: descEl ? descEl.innerHTML : '',
            preview: links[0] ? links[0].getAttribute('href') : '#',
            github: links[1] ? links[1].getAttribute('href') : '#'
        });
    });
    data._customProjects = customProjects;

    // Track which default projects the user has deleted, so they stay gone after reload.
    data._hiddenDefaults = DEFAULT_PROJECT_IDS.filter(id => !document.querySelector(`.project-card[data-project-id="${id}"]`));

    // Site-wide theme color (see THEME PICKER section below)
    data._theme = currentThemeId;

    data._savedAt = Date.now();

    return data;
}

function saveAllData() {
    const data = collectAllData();
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Save error:', e);
        showToast("Couldn't save locally — this browser/page is blocking local storage.");
    }
    writeDataFile(data); // no-op until a data.js file is linked
}

function applyData(data) {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (data[key] !== undefined) el.innerHTML = data[key];
    });

    document.querySelectorAll('[data-link-key]').forEach(el => {
        const key = 'link__' + el.getAttribute('data-link-key');
        if (data[key]) el.setAttribute('href', data[key]);
    });

    if (data._profilePic) profilePic.src = data._profilePic;

    if (Array.isArray(data._skills)) {
        const container = document.getElementById('skillBars');
        container.innerHTML = '';
        data._skills.forEach(s => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            div.dataset.skill = s.name;
            div.dataset.level = s.level;
            div.innerHTML = `<div class="flex justify-between items-center mb-2"><span class="text-sm text-neutral-300">${s.name}</span><div class="flex items-center gap-2"><span class="text-xs font-medium" style="color:var(--theme-primary)">${s.level}%</span><button class="skill-delete-btn" title="Remove skill"><i data-lucide="x" class="w-3 h-3"></i></button></div></div><div class="h-2 rounded-full bg-neutral-800 overflow-hidden"><div class="skill-bar-fill h-full rounded-full" style="--skill-level:${s.level}%;background:linear-gradient(to right,var(--theme-primary),var(--theme-secondary))"></div></div>`;
            container.appendChild(div);
        });
        lucide.createIcons();
    }

    if (Array.isArray(data._tools)) {
        const container = document.getElementById('toolsList');
        container.innerHTML = '';
        data._tools.forEach(name => renderToolTag(name));
        lucide.createIcons();
    }

    if (Array.isArray(data._hiddenDefaults)) {
        data._hiddenDefaults.forEach(id => {
            const el = document.querySelector(`.project-card[data-project-id="${id}"]`);
            if (el) el.remove();
        });
    }

    if (Array.isArray(data._customProjects)) {
        data._customProjects.forEach(p => renderProjectCard(p, true));
    }

    if (data._theme) applyTheme(data._theme, false);
}

function loadAllData() {
    let localData = null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) localData = JSON.parse(raw);
    } catch (e) { console.error('Load error:', e); }

    const fileData = (typeof window.SITE_DATA === 'object' && window.SITE_DATA) ? window.SITE_DATA : null;

    let data;
    if (fileData && localData) {
        data = (localData._savedAt || 0) >= (fileData._savedAt || 0) ? localData : fileData;
    } else {
        data = localData || fileData;
    }
    if (!data) return; // no data.js and nothing saved yet — keep the hard-coded HTML defaults

    applyData(data);

    // Keep the localStorage cache aligned with whichever source we used.
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

// Auto-save on any edit. Safe to call repeatedly — it just re-attaches
// listeners, and browsers ignore duplicate identical listeners.
function attachAutoSave() {
    document.querySelectorAll('[data-key]').forEach(el => {
        el.addEventListener('blur', saveAllData);
        el.addEventListener('input', () => { clearTimeout(el._saveTimer); el._saveTimer = setTimeout(saveAllData, 500); });
    });
}
window.addEventListener('beforeunload', saveAllData);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveAllData(); });

// ===== PROJECT CARDS =====
// Builds a project card element. `isCustom` marks user-added cards so
// they get a delete button and are the ones persisted as _customProjects.
function renderProjectCard(project, isCustom) {
    const grid = document.getElementById('projectsGrid');
    const card = document.createElement('div');
    card.className = 'slide-up visible project-card card-3d glass rounded-2xl overflow-hidden border-glow';
    if (isCustom) card.setAttribute('data-custom', 'true');
    card.style.animation = 'scaleIn .4s ease-out forwards';

    const isEditable = editMode ? 'true' : 'false';
    card.innerHTML = `
        <div class="h-40 overflow-hidden flex items-center justify-center" style="background:rgba(var(--theme-primary-rgb),.06)"><i data-lucide="code" class="w-14 h-14" style="color:var(--theme-primary);opacity:.7"></i></div>
        <div class="p-6">
            <h4 class="text-base font-medium mb-2" contenteditable="${isEditable}" data-key="custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}" data-role="title">${project.title || 'New Project'}</h4>
            <p class="text-sm text-neutral-400 leading-relaxed mb-4" contenteditable="${isEditable}" data-key="custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}" data-role="desc">${project.desc || 'Describe what this project does and what you used to build it.'}</p>
            <div class="flex gap-3">
                <a href="${project.preview || '#'}" target="_blank" rel="noopener" class="btn-3d-outline flex-1 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5" style="border:1px solid rgba(var(--theme-primary-rgb),.3);color:var(--theme-primary)"><i data-lucide="external-link" class="w-3.5 h-3.5"></i>Live Preview</a>
                <a href="${project.github || '#'}" target="_blank" rel="noopener" class="btn-3d-outline flex-1 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5" style="border:1px solid rgba(255,255,255,.12);color:#e5e5e5"><i data-lucide="github" class="w-3.5 h-3.5"></i>GitHub</a>
                ${isCustom ? '<button class="project-delete-btn w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-red-500/10" style="border:1px solid rgba(239,68,68,.25)" title="Delete project"><i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i></button>' : ''}
            </div>
        </div>
    `;
    grid.appendChild(card);
    lucide.createIcons();
    attachAutoSave();
    attachCardTilt(card);
    return card;
}

// Give dynamically added cards the same subtle 3D tilt-on-hover the
// static ones get from script.js (which only wires up cards present
// at initial page load).
function attachCardTilt(c) {
    c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        c.style.transform = `rotateY(${((e.clientX - r.left) / r.width - .5) * 12}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 12}deg) translateZ(20px)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
    if (!editMode) { showToast('Enter PIN first to edit'); return; }
    renderProjectCard({ title: 'New Project', desc: 'Describe what this project does and what you used to build it.', preview: '#', github: '#' }, true);
    saveAllData();
    showToast('Project added! Click the title, description, or button links to edit.');
});

// Delete a custom project card (event delegation so it works for
// cards added at any point, including ones restored on page load).
document.addEventListener('click', e => {
    const delBtn = e.target.closest('.project-delete-btn');
    if (!delBtn) return;
    if (!editMode) { showToast('Enter PIN first to edit'); return; }
    const card = delBtn.closest('.project-card');
    if (card && confirm('Delete this project?')) {
        card.remove();
        saveAllData();
        showToast('Project deleted.');
    }
});

// Editing a project's Live Preview / GitHub link: click it while in
// edit mode to set the URL instead of navigating.
document.addEventListener('click', e => {
    const link = e.target.closest('.project-card a');
    if (!link) return;
    if (editMode) {
        e.preventDefault();
        const label = link.textContent.trim();
        const current = link.getAttribute('href');
        const url = prompt(`Enter the ${label} URL:`, (!current || current === '#') ? 'https://' : current);
        if (url) { link.setAttribute('href', url); saveAllData(); showToast('Link updated!'); }
    } else if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('No link added yet for this project.');
    }
});

// ===== TOOLS & TECHNOLOGIES =====
function renderToolTag(name) {
    const container = document.getElementById('toolsList');
    const tag = document.createElement('span');
    tag.className = 'tool-tag px-3 py-1.5 rounded-lg glass-light text-xs text-neutral-300 hover:text-white transition-all flex items-center gap-1.5';
    tag.dataset.tool = name;
    tag.innerHTML = `<span>${name}</span><button class="tool-delete-btn" title="Remove tool"><i data-lucide="x" class="w-3 h-3"></i></button>`;
    container.appendChild(tag);
    return tag;
}

document.getElementById('addToolBtn').addEventListener('click', () => {
    if (!editMode) { showToast('Enter PIN first to edit'); return; }
    const name = prompt('Tool or technology name:');
    if (!name || !name.trim()) return;
    renderToolTag(name.trim());
    lucide.createIcons();
    saveAllData();
    showToast(`"${name.trim()}" added!`);
});

// Delete a tool tag (event delegation, works for tags added at any point).
document.addEventListener('click', e => {
    const delBtn = e.target.closest('.tool-delete-btn');
    if (!delBtn) return;
    if (!editMode) { showToast('Enter PIN first to edit'); return; }
    const tag = delBtn.closest('.tool-tag');
    if (tag) {
        tag.remove();
        saveAllData();
        showToast('Tool removed.');
    }
});

// Delete a skill/proficiency bar (event delegation, works for skills
// added at any point, including ones restored on page load).
document.addEventListener('click', e => {
    const delBtn = e.target.closest('.skill-delete-btn');
    if (!delBtn) return;
    if (!editMode) { showToast('Enter PIN first to edit'); return; }
    const item = delBtn.closest('.skill-item');
    if (item) {
        const name = item.dataset.skill || 'Skill';
        item.remove();
        saveAllData();
        showToast(`"${name}" removed.`);
    }
});

// Editing a social profile link: click it while in edit mode to set the
// URL instead of navigating.
document.addEventListener('click', e => {
    const link = e.target.closest('a[data-link-key^="social-"]');
    if (!link) return;
    if (editMode) {
        e.preventDefault();
        const label = link.getAttribute('title') || 'profile';
        const current = link.getAttribute('href');
        const url = prompt(`Enter your ${label} URL:`, (!current || current === '#') ? 'https://' : current);
        if (url) { link.setAttribute('href', url); saveAllData(); showToast('Link updated!'); }
    } else if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('No link added yet for this profile.');
    }
});

// ===== ADD SKILL MODAL =====
const sm = document.getElementById('skillModal'), nsl = document.getElementById('newSkillLevel'), sld = document.getElementById('skillLevelDisplay');
document.getElementById('addSkillBtn').addEventListener('click', () => { if (!editMode) { showToast('Enter PIN first to edit'); return; } sm.style.display = 'flex'; });
document.getElementById('closeSkillModal').addEventListener('click', () => { sm.style.display = 'none'; });
sm.addEventListener('click', e => { if (e.target === sm) sm.style.display = 'none'; });
nsl.addEventListener('input', () => { sld.textContent = nsl.value + '%'; });
document.getElementById('saveSkillBtn').addEventListener('click', () => {
    const n = document.getElementById('newSkillName').value.trim(), l = nsl.value;
    if (!n) { sld.textContent = 'Enter a name!'; sld.style.color = '#EF4444'; setTimeout(() => { sld.style.color = 'var(--theme-primary)'; sld.textContent = l + '%'; }, 2000); return; }
    const el = document.createElement('div');
    el.className = 'skill-item';
    el.dataset.skill = n;
    el.dataset.level = l;
    el.style.animation = 'scaleIn .5s ease-out forwards';
    el.innerHTML = `<div class="flex justify-between items-center mb-2"><span class="text-sm text-neutral-300">${n}</span><div class="flex items-center gap-2"><span class="text-xs font-medium" style="color:var(--theme-primary)">${l}%</span><button class="skill-delete-btn" title="Remove skill"><i data-lucide="x" class="w-3 h-3"></i></button></div></div><div class="h-2 rounded-full bg-neutral-800 overflow-hidden"><div class="skill-bar-fill h-full rounded-full animated" style="--skill-level:${l}%;background:linear-gradient(to right,var(--theme-primary),var(--theme-secondary))"></div></div>`;
    document.getElementById('skillBars').appendChild(el);
    lucide.createIcons();
    document.getElementById('newSkillName').value = '';
    nsl.value = 50;
    sld.textContent = '50%';
    sm.style.display = 'none';
    saveAllData();
    showToast(`"${n}" added!`);
});

// ===== THEME PICKER =====
// Every accent color across the site (buttons, glows, links, gradients)
// is driven by the --theme-primary / --theme-secondary / --theme-tertiary
// CSS variables defined in styles.css. Switching a preset here just
// rewrites those variables on :root — no other code needs to change.
const THEME_PRESETS = {
    violet:  { name: 'Violet',  primary: '139,92,246',  secondary: '37,99,235',  tertiary: '96,165,250' },
    blue:    { name: 'Blue',    primary: '37,99,235',   secondary: '14,165,233', tertiary: '96,165,250' },
    green:   { name: 'Green',   primary: '16,185,129',  secondary: '5,150,105',  tertiary: '110,231,183' },
    red:     { name: 'Red',     primary: '239,68,68',   secondary: '185,28,28',  tertiary: '252,165,165' },
    orange:  { name: 'Orange',  primary: '249,115,22',  secondary: '234,88,12',  tertiary: '253,186,116' },
    pink:    { name: 'Pink',    primary: '236,72,153',  secondary: '219,39,119', tertiary: '244,114,182' },
    teal:    { name: 'Teal',    primary: '20,184,166',  secondary: '13,148,136', tertiary: '94,234,212' },
    mono:    { name: 'Mono',    primary: '212,212,212', secondary: '115,115,115',tertiary: '245,245,245' }
};
let currentThemeId = 'violet';

function hexOf(rgb) {
    return '#' + rgb.split(',').map(n => (+n).toString(16).padStart(2, '0')).join('');
}

function applyTheme(id, persist = true) {
    const preset = THEME_PRESETS[id];
    if (!preset) return;
    currentThemeId = id;
    const root = document.documentElement.style;
    root.setProperty('--theme-primary-rgb', preset.primary);
    root.setProperty('--theme-secondary-rgb', preset.secondary);
    root.setProperty('--theme-tertiary-rgb', preset.tertiary);
    root.setProperty('--theme-primary', hexOf(preset.primary));
    root.setProperty('--theme-secondary', hexOf(preset.secondary));
    root.setProperty('--theme-tertiary', hexOf(preset.tertiary));
    document.querySelectorAll('.theme-swatch').forEach(sw => sw.classList.toggle('active', sw.dataset.theme === id));
    if (persist) { saveAllData(); showToast(`Theme set to ${preset.name}`); }
}

function renderThemeSwatches() {
    const wrap = document.getElementById('themeSwatches');
    wrap.innerHTML = '';
    Object.entries(THEME_PRESETS).forEach(([id, preset]) => {
        const sw = document.createElement('div');
        sw.className = 'theme-swatch' + (id === currentThemeId ? ' active' : '');
        sw.dataset.theme = id;
        sw.title = preset.name;
        sw.style.background = `linear-gradient(135deg, ${hexOf(preset.primary)}, ${hexOf(preset.secondary)})`;
        sw.addEventListener('click', () => { applyTheme(id); themePanel.style.display = 'none'; });
        wrap.appendChild(sw);
    });
}

const themeToggleBtn = document.getElementById('themeToggle');
const themePanel = document.getElementById('themePanel');
renderThemeSwatches();
themeToggleBtn.addEventListener('click', () => {
    if (!editMode) { showToast('Enter PIN first to change the theme'); return; }
    themePanel.style.display = themePanel.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', e => {
    if (!themePanel.contains(e.target) && e.target !== themeToggleBtn && !themeToggleBtn.contains(e.target)) {
        themePanel.style.display = 'none';
    }
});

// ===== INIT =====
loadAllData();
attachAutoSave();
initFileLink();
