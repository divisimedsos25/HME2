/* ══════════════════════════════════════════════
   script.js — HME POLJAM
   Navbar · Cursor · Reveal · Tabel Kegiatan
══════════════════════════════════════════════ */

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

/* ─── Hamburger / Drawer ─── */
const hamburger    = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');
const mobileOverlay= document.getElementById('mobileOverlay');
const drawerClose  = document.getElementById('drawerClose');

function openDrawer()  { hamburger.classList.add('open'); mobileDrawer.classList.add('show'); mobileOverlay.classList.add('show'); document.body.style.overflow='hidden'; }
function closeDrawer() { hamburger.classList.remove('open'); mobileDrawer.classList.remove('show'); mobileOverlay.classList.remove('show'); document.body.style.overflow=''; }

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
mobileOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));

/* ─── Custom Cursor ─── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
if (dot && ring) {
  let rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    rx += (e.clientX - rx) * .12;
    ry += (e.clientY - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
  });
  setInterval(() => {}, 16);
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
  });
  document.addEventListener('mousedown', () => dot.classList.add('click'));
  document.addEventListener('mouseup',   () => dot.classList.remove('click'));
}

/* ─── Scroll Reveal ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Ripple on buttons ─── */
document.querySelectorAll('.btn-orange, .dc-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple-el';
    const rect = this.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left) + 'px';
    r.style.top  = (e.clientY - rect.top)  + 'px';
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});

/* ══════════════════════════════════════════════
   TABEL KEGIATAN
══════════════════════════════════════════════ */

/* ── Data awal (contoh) ── */
let kegiatan = [
  { id: 1, nama: 'Rapat Perdana Pengurus', tanggal: '2025-02-10', pic: 'BPH', status: 'Selesai',      ket: 'Pembagian tugas pengurus baru' },
  { id: 2, nama: 'Seminar Nasional Teknik Elektro', tanggal: '2025-03-22', pic: 'Div. Pendidikan', status: 'Selesai',      ket: 'Hadirkan pembicara dari PLN' },
  { id: 3, nama: 'Lomba Desain PCB Nasional', tanggal: '2025-05-15', pic: 'Div. Keilmuan', status: 'Berlangsung', ket: 'Pendaftaran s/d 30 April' },
  { id: 4, nama: 'Workshop Arduino & IoT', tanggal: '2025-06-08', pic: 'Div. Pendidikan', status: 'Akan Datang', ket: 'Terbuka untuk umum' },
  { id: 5, nama: 'Musyawarah Anggota Tahunan', tanggal: '2025-12-01', pic: 'BPH', status: 'Akan Datang', ket: 'Agenda: LPJ & pemilihan ketua' },
];
let nextId    = 6;
let editId    = null;
let sortCol   = null;
let sortDir   = 'asc';
let filterStr = '';
let filterSts = '';

/* ── Util: format tanggal ── */
function fmtDate(str) {
  if (!str) return '-';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
}

/* ── Badge status ── */
function statusBadge(s) {
  const map = {
    'Selesai':     's-selesai',
    'Berlangsung': 's-berlangsung',
    'Akan Datang': 's-akan',
    'Dibatalkan':  's-batal',
  };
  return `<span class="status-badge ${map[s] || ''}">${s}</span>`;
}

/* ── Render tabel ── */
function renderTable() {
  const body  = document.getElementById('kegiatanBody');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('rowCount');

  let data = [...kegiatan];

  // Filter pencarian
  if (filterStr) {
    const q = filterStr.toLowerCase();
    data = data.filter(r =>
      r.nama.toLowerCase().includes(q) ||
      (r.pic  || '').toLowerCase().includes(q) ||
      (r.ket  || '').toLowerCase().includes(q)
    );
  }
  if (filterSts) data = data.filter(r => r.status === filterSts);

  // Sort
  if (sortCol) {
    data.sort((a, b) => {
      let va = a[sortCol] || '', vb = b[sortCol] || '';
      if (sortCol === 'tanggal') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }

  count.textContent = `${data.length} kegiatan`;

  if (!data.length) {
    body.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  body.innerHTML = data.map((r, i) => `
    <tr data-id="${r.id}">
      <td class="td-no">${i + 1}</td>
      <td><span class="editable" contenteditable="true" data-field="nama" data-id="${r.id}">${r.nama}</span></td>
      <td><span class="editable" contenteditable="true" data-field="tanggal" data-id="${r.id}" title="${r.tanggal}">${fmtDate(r.tanggal)}</span></td>
      <td><span class="editable" contenteditable="true" data-field="pic" data-id="${r.id}">${r.pic || '-'}</span></td>
      <td>${statusBadge(r.status)}</td>
      <td><span class="editable" contenteditable="true" data-field="ket" data-id="${r.id}">${r.ket || ''}</span></td>
      <td class="td-aksi">
        <button class="btn-edit" data-id="${r.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-del"  data-id="${r.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  /* Inline edit — blur simpan */
  body.querySelectorAll('.editable').forEach(el => {
    el.addEventListener('blur', () => {
      const id    = parseInt(el.dataset.id);
      const field = el.dataset.field;
      const val   = el.innerText.trim();
      const row   = kegiatan.find(r => r.id === id);
      if (row && val) row[field] = val;
      saveLocal();
    });
    // prevent newline
    el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } });
  });

  /* Tombol edit & hapus */
  body.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openModal(parseInt(btn.dataset.id)));
  });
  body.querySelectorAll('.btn-del').forEach(btn => {
    btn.addEventListener('click', () => deleteRow(parseInt(btn.dataset.id)));
  });
}

/* ── Modal ── */
const overlay     = document.getElementById('modalOverlay');
const modalTitle  = document.getElementById('modalTitle');
const fNama       = document.getElementById('fNama');
const fTanggal    = document.getElementById('fTanggal');
const fStatus     = document.getElementById('fStatus');
const fPIC        = document.getElementById('fPIC');
const fKet        = document.getElementById('fKet');

function openModal(id = null) {
  editId = id;
  if (id) {
    const r = kegiatan.find(r => r.id === id);
    modalTitle.textContent = 'Edit Kegiatan';
    fNama.value    = r.nama;
    fTanggal.value = r.tanggal;
    fStatus.value  = r.status;
    fPIC.value     = r.pic || '';
    fKet.value     = r.ket || '';
  } else {
    modalTitle.textContent = 'Tambah Kegiatan';
    fNama.value = fTanggal.value = fPIC.value = fKet.value = '';
    fStatus.value = 'Akan Datang';
  }
  overlay.classList.add('show');
  fNama.focus();
}

function closeModal() { overlay.classList.remove('show'); editId = null; }

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

document.getElementById('modalSave').addEventListener('click', () => {
  const nama = fNama.value.trim();
  if (!nama) { fNama.focus(); fNama.style.borderColor='#F87171'; return; }
  fNama.style.borderColor = '';

  if (editId) {
    const r = kegiatan.find(r => r.id === editId);
    r.nama = nama; r.tanggal = fTanggal.value;
    r.status = fStatus.value; r.pic = fPIC.value.trim();
    r.ket = fKet.value.trim();
  } else {
    kegiatan.push({ id: nextId++, nama, tanggal: fTanggal.value,
      status: fStatus.value, pic: fPIC.value.trim(), ket: fKet.value.trim() });
  }
  saveLocal();
  closeModal();
  renderTable();
});

/* ── Hapus ── */
function deleteRow(id) {
  if (!confirm('Yakin hapus kegiatan ini?')) return;
  kegiatan = kegiatan.filter(r => r.id !== id);
  saveLocal();
  renderTable();
}

/* ── Tombol Tambah ── */
document.getElementById('addRowBtn').addEventListener('click', () => openModal());

/* ── Search & Filter ── */
document.getElementById('searchInput').addEventListener('input', e => {
  filterStr = e.target.value;
  renderTable();
});
document.getElementById('filterStatus').addEventListener('change', e => {
  filterSts = e.target.value;
  renderTable();
});

/* ── Sort header ── */
document.querySelectorAll('.tabel-kegiatan th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.col;
    if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortCol = col; sortDir = 'asc'; }
    document.querySelectorAll('.tabel-kegiatan th').forEach(h => h.classList.remove('sort-asc','sort-desc'));
    th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    renderTable();
  });
});

/* ── Export CSV ── */
document.getElementById('exportBtn').addEventListener('click', () => {
  const header = ['No','Nama Kegiatan','Tanggal','Penanggung Jawab','Status','Keterangan'];
  const rows = kegiatan.map((r, i) =>
    [i+1, r.nama, r.tanggal, r.pic || '', r.status, r.ket || ''].map(v => `"${v}"`).join(',')
  );
  const csv  = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a'); a.href = url;
  a.download = 'kegiatan-hme-poljam.csv'; a.click();
  URL.revokeObjectURL(url);
});

/* ── LocalStorage ── */
function saveLocal() {
  localStorage.setItem('hme-kegiatan', JSON.stringify({ data: kegiatan, nextId }));
}
function loadLocal() {
  try {
    const raw = localStorage.getItem('hme-kegiatan');
    if (!raw) return;
    const { data, nextId: nid } = JSON.parse(raw);
    if (Array.isArray(data) && data.length) { kegiatan = data; nextId = nid || 100; }
  } catch(e) {}
}

/* ── Init ── */
loadLocal();
renderTable();
