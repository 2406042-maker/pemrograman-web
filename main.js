// Array Utama (Data Proyek)
let projects = [
  {
    id: 1,
    title: "Sistem Inventaris Keuangan",
    category: "Web App",
    budget: 2500000,
    completed: true
  },
  {
    id: 2,
    title: "Sistem Kasir Digital POS",
    category: "Desktop App",
    budget: 5000000,
    completed: true
  },
  {
    id: 3,
    title: "Landing Page Profil Perusahaan",
    category: "Web App",
    budget: 1500000,
    completed: false
  },
  {
    id: 4,
    title: "Aplikasi Presensi GPS Mobile",
    category: "Mobile App",
    budget: 4500000,
    completed: false
  }
];

let activeCategory = "Semua";
let searchQuery = "";

// Format Angka ke Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(angka);
};

// Update Kartu Ringkasan Statistik
const updateStats = () => {
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = projects.filter(item => item.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent = completedCount;
};

// Render Daftar Proyek
const renderProjects = () => {
  const container = document.getElementById("project-list");
  if (!container) return;

  // FITUR 2: Live Search dengan .filter() dan .toLowerCase().includes()
  const filteredList = projects.filter(proj => {
    const matchesCategory = activeCategory === "Semua" || proj.category === activeCategory;
    const matchesSearch = proj.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredList.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Proyek tidak ditemukan.</p>";
    return;
  }

  // FITUR 3: Tombol 'Ubah Status' & 'Hapus Proyek' di setiap kartu
  const htmlString = filteredList.map(proj => {
    const badgeClass = proj.completed ? "badge-success" : "badge-pending";
    const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

    return `
      <div class="project-card">
        <div class="project-info">
          <span class="project-category">${proj.category}</span>
          <h4>${proj.title}</h4>
          <p class="project-budget">${formatRupiah(proj.budget)}</p>
        </div>
        <div class="actions-group">
          <span class="badge ${badgeClass}">${statusText}</span>
          <button class="btn-action btn-toggle" onclick="toggleStatus(${proj.id})">Ubah Status</button>
          <button class="btn-action btn-delete" onclick="deleteProject(${proj.id})">Hapus Proyek</button>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = htmlString;
};

// Fungsi Memperbarui Seluruh Tampilan
const refreshUI = () => {
  renderProjects();
  updateStats();
};

// FITUR 1: Form Handling & Validation
const handleAddProject = (e) => {
  e.preventDefault(); // Cegah reload halaman

  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("category");
  const budgetInput = document.getElementById("budget");
  const completedInput = document.getElementById("completed");

  const titleValue = titleInput.value.trim();
  const budgetValue = parseFloat(budgetInput.value);

  // Validasi
  if (!titleValue) {
    alert("Judul proyek tidak boleh kosong!");
    return;
  }

  if (isNaN(budgetValue) || budgetValue <= 0) {
    alert("Anggaran harus lebih besar dari 0!");
    return;
  }

  // Buat Objek Baru dengan ID Unik Date.now()
  const newProject = {
    id: Date.now(),
    title: titleValue,
    category: categoryInput.value,
    budget: budgetValue,
    completed: completedInput.checked
  };

  // Masukkan ke Array menggunakan Spread Operator
  projects = [...projects, newProject];

  // Reset Form
  document.getElementById("project-form").reset();

  // Render ulang Tampilan
  refreshUI();
};

// FITUR 3 (a): Tombol Ubah Status
const toggleStatus = (id) => {
  projects = projects.map(proj => {
    if (proj.id === id) {
      return { ...proj, completed: !proj.completed };
    }
    return proj;
  });
  refreshUI();
};

// FITUR 3 (b): Tombol Hapus Proyek berdasarkan ID
const deleteProject = (id) => {
  projects = projects.filter(proj => proj.id !== id);
  refreshUI();
};

// Inisialisasi Event Listener
document.addEventListener("DOMContentLoaded", () => {
  refreshUI();

  // Listener Submit Form (Fitur 1)
  const projectForm = document.getElementById("project-form");
  if (projectForm) {
    projectForm.addEventListener("submit", handleAddProject);
  }

  // Listener Event 'input' untuk Live Search (Fitur 2)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
  }

  // Listener Filter Kategori
  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      activeCategory = e.target.getAttribute("data-category");
      renderProjects();
    });
  });
});