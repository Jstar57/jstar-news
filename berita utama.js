// Menunggu seluruh dokumen HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
    
    // Mengambil semua tombol "Baca Selengkapnya"
    const readMoreButtons = document.querySelectorAll(".read-more");

    // Memberikan aksi klik pada setiap tombol
    readMoreButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault(); // Mencegah reload halaman untuk sementara
            
            // Mengambil judul berita terkait
            const articleTitle = this.closest(".news-card").querySelector("h2").innerText;
            
            alert(`Membuka halaman untuk berita:\n"${articleTitle}"\n\n(Halaman artikel penuh bisa ditambahkan di langkah selanjutnya!)`);
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Fitur Scroll Otomatis dari tombol Hero
    const exploreBtn = document.getElementById("exploreBtn");
    const newsSection = document.getElementById("newsSection");

    if (exploreBtn && newsSection) {
        exploreBtn.addEventListener("click", function() {
            newsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ==========================================
    // 2. FITUR FILTER KATEGORI BERITA
    // ==========================================
    const navLinks = document.querySelectorAll(".nav-link");
    const newsCards = document.querySelectorAll(".news-card");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault(); // Mencegah reload halaman saat menu diklik

            // Hapus class 'active' dari semua menu, lalu tambah ke menu yang diklik
            navLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");

            // Ambil ID dari menu yang diklik (misal: nav-teknologi -> diambil kata 'teknologi')
            const targetCategory = this.id.replace("nav-", "");

            // Jika yang diklik adalah Home, tampilkan semua berita
            if (targetCategory === "home") {
                newsCards.forEach(card => {
                    card.style.display = "flex"; // Tampilkan semua
                });
            } else {
                // Jika kategori lain, saring satu per satu
                newsCards.forEach(card => {
                    const cardCategory = card.getAttribute("data-category");
                    
                    if (cardCategory === targetCategory) {
                        card.style.display = "flex"; // Tampilkan yang cocok
                    } else {
                        card.style.display = "none";  // Sembunyikan sisanya
                    }
                });

                // Otomatis scroll sedikit ke area berita setelah kategori dipilih
                if (newsSection) {
                    newsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});