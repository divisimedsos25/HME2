/* ══════════════════════════════════════════════
   script.js — HME POLJAM  (FIXED)
══════════════════════════════════════════════ */

/* ─── Navbar scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
const secObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => secObserver.observe(s));

/* ─── Hamburger / Drawer ─── */
const hamburger     = document.getElementById('hamburger');
const mobileDrawer  = document.getElementById('mobileDrawer');
const mobileOverlay = document.getElementById('mobileOverlay');
const drawerClose   = document.getElementById('drawerClose');

function openDrawer()  {
  hamburger.classList.add('open');
  mobileDrawer.classList.add('show');
  mobileOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  hamburger.classList.remove('open');
  mobileDrawer.classList.remove('show');
  mobileOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
mobileOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));

/* ─── Custom Cursor — FIXED: pakai requestAnimationFrame ─── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0; // posisi mouse
  let rx = 0, ry = 0; // posisi ring (lagging)

  // Simpan posisi mouse saat bergerak
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // BUG FIX: animasi ring pakai rAF agar halus, bukan di dalam mousemove
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // BUG FIX: pakai event delegation agar hover aktif di elemen dinamis juga
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button')) {
      dot.classList.add('hov');
      ring.classList.add('hov');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button')) {
      dot.classList.remove('hov');
      ring.classList.remove('hov');
    }
  });

  document.addEventListener('mousedown', () => dot.classList.add('click'));
  document.addEventListener('mouseup',   () => dot.classList.remove('click'));
}

/* ─── Scroll Reveal ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Ripple effect ─── */
document.querySelectorAll('.btn-orange, .dc-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r    = document.createElement('span');
    r.className = 'ripple-el';
    const rect  = this.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left) + 'px';
    r.style.top  = (e.clientY - rect.top)  + 'px';
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});

/* ══════════════════════════════════════════════
   TABEL KEGIATAN
══════════════════════════════════════════════ */

let kegiatan = [
  { id:1, nama:'Rapat Perdana Pengurus',          tanggal:'2025-02-10', pic:'BPH',             status:'Selesai',     ket:'Pembagian tugas pengurus baru' },
  { id:2, nama:'Seminar Nasional Teknik Elektro', tanggal:'2025-03-22', pic:'Div. Pendidikan', status:'Selesai',     ket:'Hadirkan pembicara dari PLN' },
  { id:3, nama:'Lomba Desain PCB Nasional',       tanggal:'2025-05-15', pic:'Div. Keilmuan',  status:'Berlangsung', ket:'Pendaftaran s/d 30 April' },
  { id:4, nama:'Workshop Arduino & IoT',           tanggal:'2025-06-08', pic:'Div. Pendidikan', status:'Akan Datang', ket:'Terbuka untuk umum' },
  { id:5, nama:'Musyawarah Anggota Tahunan',      tanggal:'2025-12-01', pic:'BPH',             status:'Akan Datang', ket:'Agenda: LPJ & pemilihan ketua' },
];
let nextId    = 6;
let editId    = null;
let sortCol   = null;
let sortDir   = 'asc';
let filterStr = '';
let filterSts = '';

/* ── Format tanggal tampilan ── */
function fmtDate(str) {
  if (!str) return '-';
  const d = new Date(str + 'T00:00:00');
  if (isNaN(d)) return str;
  return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
}

/* ── Badge status ── */
const statusClass = {
  'Selesai':    's-selesai',
  'Berlangsung':'s-berlangsung',
  'Akan Datang':'s-akan',
  'Dibatalkan': 's-batal',
};
function statusBadge(s) {
  return `<span class="status-badge ${statusClass[s] || ''}">${s}</span>`;
}

/* ── Render tabel ── */
function renderTable() {
  const body  = document.getElementById('kegiatanBody');
  const empty = document.getElementById('emptyState');
  const count = document.getElementById('rowCount');

  let data = [...kegiatan];

  if (filterStr) {
    const q = filterStr.toLowerCase();
    data = data.filter(r =>
      r.nama.toLowerCase().includes(q) ||
      (r.pic || '').toLowerCase().includes(q) ||
      (r.ket || '').toLowerCase().includes(q)
    );
  }
  if (filterSts) data = data.filter(r => r.status === filterSts);

  if (sortCol) {
    data.sort((a, b) => {
      const va = (a[sortCol] || '').toLowerCase();
      const vb = (b[sortCol] || '').toLowerCase();
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
      <td>
        <span class="editable" contenteditable="true"
          data-field="nama" data-id="${r.id}">${escHtml(r.nama)}</span>
      </td>
      <td>
        <!-- BUG FIX: tanggal TIDAK contenteditable, klik buka modal -->
        <span class="td-tanggal-cell" data-id="${r.id}"
          title="Klik ✏️ untuk ganti tanggal">${fmtDate(r.tanggal)}</span>
      </td>
      <td>
        <span class="editable" contenteditable="true"
          data-field="pic" data-id="${r.id}">${escHtml(r.pic || '')}</span>
      </td>
      <td>${statusBadge(r.status)}</td>
      <td>
        <span class="editable" contenteditable="true"
          data-field="ket" data-id="${r.id}">${escHtml(r.ket || '')}</span>
      </td>
      <td class="td-aksi">
        <button class="btn-edit" data-id="${r.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-del"  data-id="${r.id}" title="Hapus"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  /* Inline edit: nama, pic, ket */
  body.querySelectorAll('.editable').forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
    });
    el.addEventListener('blur', () => {
      const id    = parseInt(el.dataset.id);
      const field = el.dataset.field;
      const val   = el.innerText.trim();
      const row   = kegiatan.find(r => r.id === id);
      if (!row) return;
      if (val) row[field] = val;
      else el.innerText = row[field] || ''; // kembalikan jika kosong
      saveLocal();
    });
  });

  /* Klik tanggal → buka modal edit */
  body.querySelectorAll('.td-tanggal-cell').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openModal(parseInt(el.dataset.id)));
  });

  /* Tombol Edit & Hapus */
  body.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openModal(parseInt(btn.dataset.id)));
  });
  body.querySelectorAll('.btn-del').forEach(btn => {
    btn.addEventListener('click', () => deleteRow(parseInt(btn.dataset.id)));
  });
}

/* ── Escape HTML untuk XSS-safe rendering ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ── Modal ── */
const overlay    = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const fNama      = document.getElementById('fNama');
const fTanggal   = document.getElementById('fTanggal');
const fStatus    = document.getElementById('fStatus');
const fPIC       = document.getElementById('fPIC');
const fKet       = document.getElementById('fKet');

function openModal(id = null) {
  editId = id;
  if (id) {
    const r = kegiatan.find(r => r.id === id);
    if (!r) return;
    modalTitle.textContent = 'Edit Kegiatan';
    fNama.value    = r.nama;
    fTanggal.value = r.tanggal || '';
    fStatus.value  = r.status;
    fPIC.value     = r.pic || '';
    fKet.value     = r.ket || '';
  } else {
    modalTitle.textContent = 'Tambah Kegiatan';
    fNama.value = '';
    fTanggal.value = '';
    fPIC.value = '';
    fKet.value = '';
    fStatus.value = 'Akan Datang';
  }
  // Reset border error
  fNama.style.borderColor = '';
  overlay.classList.add('show');
  setTimeout(() => fNama.focus(), 100); // delay agar animasi modal selesai dulu
}

function closeModal() {
  overlay.classList.remove('show');
  editId = null;
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

// Tutup modal dengan Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('show')) closeModal();
});

document.getElementById('modalSave').addEventListener('click', () => {
  const nama = fNama.value.trim();
  if (!nama) {
    fNama.style.borderColor = '#F87171';
    fNama.focus();
    return;
  }
  fNama.style.borderColor = '';

  if (editId) {
    const r = kegiatan.find(r => r.id === editId);
    if (r) {
      r.nama    = nama;
      r.tanggal = fTanggal.value;
      r.status  = fStatus.value;
      r.pic     = fPIC.value.trim();
      r.ket     = fKet.value.trim();
    }
  } else {
    kegiatan.push({
      id:      nextId++,
      nama,
      tanggal: fTanggal.value,
      status:  fStatus.value,
      pic:     fPIC.value.trim(),
      ket:     fKet.value.trim(),
    });
  }

  saveLocal();
  closeModal();
  renderTable();
});

/* ── Hapus baris ── */
function deleteRow(id) {
  if (!confirm('Yakin hapus kegiatan ini?')) return;
  kegiatan = kegiatan.filter(r => r.id !== id);
  saveLocal();
  renderTable();
}

/* ── Tombol Tambah ── */
document.getElementById('addRowBtn').addEventListener('click', () => openModal());

/* ── Search ── */
document.getElementById('searchInput').addEventListener('input', e => {
  filterStr = e.target.value.trim();
  renderTable();
});

/* ── Filter status ── */
document.getElementById('filterStatus').addEventListener('change', e => {
  filterSts = e.target.value;
  renderTable();
});

/* ── Sort header (hanya di thead statis, tidak perlu diulang) ── */
document.querySelectorAll('.tabel-kegiatan th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const col = th.dataset.col;
    if (sortCol === col) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortCol = col;
      sortDir = 'asc';
    }
    document.querySelectorAll('.tabel-kegiatan th').forEach(h =>
      h.classList.remove('sort-asc', 'sort-desc')
    );
    th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    renderTable();
  });
});

/* ── Export CSV ── */
document.getElementById('exportBtn').addEventListener('click', () => {
  const header = ['No','Nama Kegiatan','Tanggal','Penanggung Jawab','Status','Keterangan'];
  const rows = kegiatan.map((r, i) =>
    [i+1, r.nama, r.tanggal || '', r.pic || '', r.status, r.ket || '']
      .map(v => `"${String(v).replace(/"/g,'""')}"`)
      .join(',')
  );
  const csv  = [header.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM untuk Excel
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'kegiatan-hme-poljam.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/* ── LocalStorage ── */
function saveLocal() {
  try {
    localStorage.setItem('hme-kegiatan', JSON.stringify({ data: kegiatan, nextId }));
  } catch(e) {
    console.warn('LocalStorage penuh atau tidak tersedia.');
  }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem('hme-kegiatan');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.data) && parsed.data.length) {
      kegiatan = parsed.data;
      nextId   = parsed.nextId || 100;
    }
  } catch(e) {
    console.warn('Gagal load data dari localStorage.');
  }
}

/* ── Init ── */
loadLocal();
renderTable();
