const SUPABASE_URL = "https://ukfzmjrodkmlhwnafvei.supabase.co";
const SUPABASE_KEY = "sb_publishable_z9pfUbcmaAU4j0_esfy2lw_8P8CCFMr"; // Pastikan key publishable lu bener

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById("commentForm");
    const commenterName = document.getElementById("commenterName");
    const commentText = document.getElementById("commentText");
    const commentsContainer = document.getElementById("commentsContainer");

    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    const idBerita = page.replace(".html", "") || "berita_utama";

    // 1. AMBIL KOMENTAR
    async function loadComments() {
        if (!commentsContainer) return;
        commentsContainer.innerHTML = "<p style='color: #888; font-size: 14px;'>Memuat komentar...</p>";
        
        let { data: comments, error } = await supabaseClient
            .from('comments')
            .select('*')
            .eq('berita_id', idBerita)
            .order('id', { ascending: true });

        if (error) {
            console.error("Gagal ambil komen:", error);
            commentsContainer.innerHTML = `<p style='color: #ff4d4d; font-size: 14px;'>Gagal memuat: ${error.message}</p>`;
            return;
        }

        commentsContainer.innerHTML = "";
        
        if (!comments || comments.length === 0) {
            commentsContainer.innerHTML = "<p style='color: #666; font-size: 14px; font-style: italic;'>Belum ada komentar. Jadilah yang pertama!</p>";
            return;
        }

        comments.forEach(comment => {
            const box = document.createElement("div");
            box.classList.add("comment-box");
            box.style.marginTop = "15px";
            // FIX: Mengubah comment.text menjadi comment.comments sesuai kolom database lu!
            box.innerHTML = `<h5>${comment.name}</h5><p>${comment.comments}</p>`;
            commentsContainer.appendChild(box);
        });
    }

    // 2. KIRIM KOMENTAR
    if (commentForm) {
        commentForm.addEventListener("submit", async function(event) {
            event.preventDefault(); 

            const nameInput = commenterName.value.trim();
            const textInput = commentText.value.trim();

            if (!nameInput || !textInput) return;

            // FIX: Mengubah key 'text' menjadi 'comments' agar sinkron dengan database lu!
            const { error } = await supabaseClient
                .from('comments')
                .insert([{ name: nameInput, comments: textInput, berita_id: idBerita }]);

            if (error) {
                alert("Gagal mengirim komentar ke database! Log: " + error.message);
                console.error(error);
            } else {
                commenterName.value = "";
                commentText.value = "";
                loadComments(); 
            }
        });
    }

    loadComments();
});
