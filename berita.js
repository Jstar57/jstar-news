const SUPABASE_URL = "https:ukfzmjrodkmlhwnafvei.supabase.co";
const SUPABASE_KEY = "sb_publishable_z9pfUbcmaAU4j0_esfy2lw_8P8CCFMr";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById("commentForm");
    const commenterName = document.getElementById("commenterName");
    const commentText = document.getElementById("commentText");
    const commentsContainer = document.getElementById("commentsContainer");

    // === TRICK PINTAR: Mengambil nama file HTML sebagai ID Berita ===
    // Contoh: kalau dibuka di 'detail-berita-2.html', idBerita jadi 'detail-berita-2'
    const idBerita = window.location.pathname.split("/").pop().replace(".html", "");

    // 1. AMBIL KOMENTAR BERDASARKAN ID BERITA
    async function loadComments() {
        commentsContainer.innerHTML = "<p style='color: #666;'>Memuat komentar...</p>";
        
        let { data: comments, error } = await supabase
            .from('comments')
            .select('*')
            .eq('berita_id', idBerita) // Hanya ambil komen yang cocok dengan ID berita ini
            .order('id', { ascending: true });

        if (error) {
            commentsContainer.innerHTML = "<p style='color: red;'>Gagal memuat komentar.</p>";
            return;
        }

        commentsContainer.innerHTML = "";
        comments.forEach(comment => {
            const box = document.createElement("div");
            box.classList.add("comment-box");
            box.innerHTML = `<h5>${comment.name}</h5><p>${comment.text}</p>`;
            commentsContainer.appendChild(box);
        });
    }

    // 2. KIRIM KOMENTAR DENGAN MENYERTAKAN ID BERITA
    commentForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nameInput = commenterName.value;
        const textInput = commentText.value;

        // Masukkan nama, teks, DAN idBerita ke Supabase
        const { error } = await supabase
            .from('comments')
            .insert([{ name: nameInput, text: textInput, berita_id: idBerita }]);

        if (error) {
            alert("Gagal mengirim komentar!");
        } else {
            commenterName.value = "";
            commentText.value = "";
            loadComments();
        }
    });

    loadComments();
});
