document.addEventListener('DOMContentLoaded', async () => {
    // Récupère l'ID passé dans l'URL (ex: article.html?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const container = document.getElementById('article-content');

    if (!articleId) {
        container.innerHTML = '<p style="color: red;">Article introuvable.</p>';
        return;
    }

    try {
        const response = await fetch('api/contents.php');
        const result = await response.json();

        if (result.status === 'success') {
            // Trouve l'article correspondant à l'ID
            const article = result.data.find(a => a.id == articleId);

            if (article) {
                const dateFormatted = new Date(article.published_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                const defaultImage = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80';
                const imageUrl = article.image_url ? article.image_url : defaultImage;

                container.innerHTML = `
                    <span class="badge">${article.category}</span>
                    <h1 style="font-family: 'Anton'; margin-top: 0.5rem; font-size: 2.2rem;">${article.title}</h1>
                    <small style="color: var(--text-muted); display: block; margin-bottom: 1rem;">
                        Publié le ${dateFormatted} par ${article.author || 'Rédaction FEGMEDIA'}
                    </small>
                    <img src="${imageUrl}" alt="${article.title}">
                    <div class="article-body">${article.body}</div>
                `;
            } else {
                container.innerHTML = '<p style="color: red;">Cet article n\'existe pas.</p>';
            }
        }
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Erreur de chargement de l\'article.</p>';
    }
});