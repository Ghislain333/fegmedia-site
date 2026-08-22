let allArticles = []; // Stockage local des articles récupérés

document.addEventListener('DOMContentLoaded', () => {
    fetchArticles();
    setupFilters();
});

// Récupération initiale depuis l'API PHP
async function fetchArticles() {
    const container = document.getElementById('articles-container');

    try {
        const response = await fetch('api/contents.php');
        const result = await response.json();

        if (result.status === 'success') {
            allArticles = result.data; // Conserve les données en mémoire
            displayArticles(allArticles);
        } else {
            container.innerHTML = `<p style="color: red;">Erreur : ${result.message}</p>`;
        }
    } catch (error) {
        console.error('Erreur lors du chargement :', error);
        container.innerHTML = '<p style="color: red;">Impossible de charger les publications pour le moment.</p>';
    }
}

// Fonction de filtrage et de gestion du bouton actif
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retire la classe active de tous les boutons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            if (category === 'ALL') {
                displayArticles(allArticles);
            } else {
                const filtered = allArticles.filter(art => art.category.toUpperCase() === category.toUpperCase());
                displayArticles(filtered);
            }
        });
    });
}

// Génération dynamique des cartes HTML
function displayArticles(articles) {
    const container = document.getElementById('articles-container');

    if (articles.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p style="color: var(--text-muted);">Aucune publication dans cette catégorie.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    articles.forEach(article => {
        const dateFormatted = new Date(article.published_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const defaultImage = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&q=80';
        const imageUrl = article.image_url ? article.image_url : defaultImage;

        const card = document.createElement('a');
        card.href = `article.html?id=${article.id}`;
        card.className = 'article-card';
        card.style.textDecoration = 'none';
        card.style.color = 'inherit';

        card.innerHTML = `
            <img src="${imageUrl}" alt="${article.title}">
            <div class="article-content">
                <span class="badge">${article.category}</span>
                <h3>${article.title}</h3>
                <p>${article.body.substring(0, 100)}...</p>
                <small style="color: var(--text-muted); display: block; margin-top: 0.8rem;">
                    Publié le ${dateFormatted}
                </small>
            </div>
        `;

        container.appendChild(card);
    });
}