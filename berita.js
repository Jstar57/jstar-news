// ISI DENGAN DATA DARI SUPABASE LU
const SUPABASE_URL = "https://ukfzmjrodkmlhwnafvei.supabase.co";
const SUPABASE_KEY = "sb_publishable_z9pfUbcmaAU4j0_esfy2lw_8P8CCFMr"; // Pastikan key publishable lu utuh di sini

// Inisialisasi koneksi ke Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById("commentForm");
    const commenterName = document.getElementById("commenterName");
    const commentText = document.getElementById("commentText");
    const commentsContainer = document.getElementById("commentsContainer");

    // === REVISI DETEKSI ID BERITA (Jauh Lebih Aman buat GitHub Pages) ===
    // Mengambil nama file akhir saja, contoh: "berita1.html" menjadi "berita1"
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    const idBerita = page.replace(".html", "") || "berita_utama";

    // 1. FUNGSI AMBIL KOMENTAR DARI DATABASE SUPABASE
    async function loadComments() {
        commentsContainer.innerHTML = "<p style='color: #888; font-size: 14px;'>Memuat komentar...</p>";
        
        // Ambil data dari tabel 'comments' yang berita_id nya cocok dengan halaman ini
        let { data: comments, error } = await supabase
            .from('comments')
            .select('*')
            .eq('berita_id', idBerita)
            .order('id', { ascending: true });

        if (error) {
            console.error("Gagal ambil komen:", error);
            commentsContainer.innerHTML = `<p style='color: #ff4d4d; font-size: 14px;'>Gagal memuat komentar. Log: ${error.message}</p>`;
            return;
        }

        // Tampilkan ke layar jika berhasil
        commentsContainer.innerHTML = "";
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = "<p style='color: #666; font-size: 14px; font-style: italic;'>Belum ada komentar. Jadilah yang pertama!</p>";
            return;
        }

        comments.forEach(comment => {
            const box = document.createElement("div");
            box.classList.add("comment-box");
            box.style.marginTop = "15px"; // Jarak antar kotak komentar
            box.innerHTML = `<h5>${comment.name}</h5><p>${comment.text}</p>`;
            commentsContainer.appendChild(box);
        });
    }

    // 2. FUNGSI KIRIM KOMENTAR BARU KE DATABASE SUPABASE
    commentForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Menahan halaman agar tidak melakukan reload/refresh!

        const nameInput = commenterName.value.trim();
        const textInput = commentText.value.trim();

        if (!nameInput || !textInput) return;

        // Memasukkan data ke tabel 'comments' di Supabase
        const { error } = await supabase
            .from('comments')
            .insert([{ name: nameInput, text: textInput, berita_id: idBerita }]);

        if (error) {
            alert("Gagal mengirim komentar! Periksa koneksi atau setingan tabel Supabase lu.");
            console.error(error);
        } else {
            // Jika berhasil, reset form input & muat ulang komentar secara real-time
            commenterName.value = "";
            commentText.value = "";
            loadComments();
        }
    });

    // Jalankan fungsi muat komentar saat pertama kali halaman dibuka
    loadComments();
});
