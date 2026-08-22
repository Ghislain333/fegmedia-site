let loadedArticles = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Vérification de la session Admin
    try {
        const res = await fetch('../api/check_auth.php');
        if (!res.ok) {
            window.location.href = 'login.html';
            return;
        }
        const data = await res.json();
        document.getElementById('user-email').textContent = data.admin.email;
    } catch (e) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Chargements initiaux des données
    loadAdminArticles();
    loadAdminMessages();
    loadAdminStats();
    loadAdminJobs(); // Chargement direct des offres d'emploi

    // 3. Soumission du formulaire de création d'article
    document.getElementById('create-article-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formMsg = document.getElementById('form-msg');
        const articleData = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            image_url: document.getElementById('image_url').value,
            body: document.getElementById('body').value
        };

        try {
            const response = await fetch('../api/create_content.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            });

            const result = await response.json();
            if (result.status === 'success') {
                formMsg.style.color = '#2ed573';
                formMsg.textContent = result.message;
                document.getElementById('create-article-form').reset();
                loadAdminArticles();
            } else {
                formMsg.style.color = '#ff4757';
                formMsg.textContent = result.message;
            }
        } catch (error) {
            formMsg.style.color = '#ff4757';
            formMsg.textContent = "Erreur lors de l'envoi.";
        }
    });

    // 4. Soumission du formulaire d'édition d'article
    const editForm = document.getElementById('edit-article-form');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editData = {
                id: document.getElementById('edit-id').value,
                title: document.getElementById('edit-title').value,
                category: document.getElementById('edit-category').value,
                image_url: document.getElementById('edit-image_url').value,
                body: document.getElementById('edit-body').value
            };

            try {
                const res = await fetch('../api/update_content.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editData)
                });
                const result = await res.json();

                if (result.status === 'success') {
                    closeEditModal();
                    loadAdminArticles();
                } else {
                    alert(result.message);
                }
            } catch (e) {
                alert("Erreur lors de la mise à jour.");
            }
        });
    }

    // 5. Soumission du formulaire de création d'emploi
    document.getElementById('add-job-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            title: document.getElementById('job-title').value,
            company: document.getElementById('job-company').value,
            location: document.getElementById('job-location').value,
            type: document.getElementById('job-type').value,
            category: document.getElementById('job-category').value,
            apply_url_or_email: document.getElementById('job-apply').value,
            description: document.getElementById('job-description').value
        };

        try {
            const res = await fetch('../api/create_job.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();

            if (result.status === 'success') {
                alert('Offre créée avec succès !');
                document.getElementById('add-job-form').reset();
                loadAdminJobs();
            } else {
                alert('Erreur: ' + result.message);
            }
        } catch (err) {
            alert('Erreur lors de la publication.');
        }
    });
});

// Récupération et affichage de la liste des articles
async function loadAdminArticles() {
    const listContainer = document.getElementById('admin-articles-list');
    if (!listContainer) return;

    try {
        const res = await fetch('../api/contents.php');
        const result = await res.json();

        if (result.status === 'success' && result.data.length > 0) {
            loadedArticles = result.data;
            listContainer.innerHTML = '';
            result.data.forEach(art => {
                const item = document.createElement('div');
                item.style.backgroundColor = 'var(--bg-card)';
                item.style.padding = '1rem';
                item.style.marginBottom = '1rem';
                item.style.borderRadius = '6px';
                item.style.borderLeft = '3px solid var(--primary-color)';

                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                        <div>
                            <span class="badge" style="font-size: 0.65rem;">${art.category}</span>
                            <h4 style="margin: 0.4rem 0;">${art.title}</h4>
                            <small style="color: var(--text-muted);">Publié le ${new Date(art.published_at).toLocaleDateString('fr-FR')}</small>
                        </div>
                        <div style="display: flex; gap: 0.5rem; white-space: nowrap;">
                            <button onclick="openEditModal(${art.id})" style="background-color: #ffa500; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">
                                Modifier
                            </button>
                            <button onclick="deleteArticle(${art.id})" style="background-color: #ff4757; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">
                                Supprimer
                            </button>
                        </div>
                    </div>
                `;
                listContainer.appendChild(item);
            });
        } else {
            listContainer.innerHTML = '<p style="color: var(--text-muted);">Aucun article publié pour l\'instant.</p>';
        }
    } catch (e) {
        listContainer.innerHTML = '<p style="color: red;">Erreur lors du chargement des articles.</p>';
    }
}

// Fonction pour charger la liste des offres d'emploi dans l'admin
async function loadAdminJobs() {
    const container = document.getElementById('admin-jobs-list');
    if (!container) return;

    try {
        const res = await fetch('../api/get_jobs.php');
        const result = await res.json();

        if (result.status === 'success' && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(job => {
                const item = document.createElement('div');
                item.style.cssText = 'background: #14151a; padding: 1rem; border-radius: 6px; margin-bottom: 0.8rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05);';
                item.innerHTML = `
                    <div>
                        <strong style="color: #fff;">${job.title}</strong> - <span style="color: #ff4757;">${job.company}</span>
                        <div style="font-size: 0.85rem; color: #888;">${job.category} | ${job.location} (${job.type})</div>
                    </div>
                    <button onclick="deleteJob(${job.id})" style="background: #e74c3c; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-weight: bold;">Supprimer</button>
                `;
                container.appendChild(item);
            });
        } else {
            container.innerHTML = '<p style="color: #888;">Aucune offre d\'emploi enregistrée pour l\'instant.</p>';
        }
    } catch (e) {
        container.innerHTML = '<p style="color: red;">Erreur au chargement des offres d\'emploi.</p>';
    }
}

// Supprimer une offre d'emploi
async function deleteJob(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette offre ?')) return;

    try {
        const res = await fetch('../api/delete_job.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const result = await res.json();

        if (result.status === 'success') {
            loadAdminJobs();
        } else {
            alert('Erreur: ' + result.message);
        }
    } catch (err) {
        alert('Erreur lors de la suppression.');
    }
}

// Utilitaires Modale
function openEditModal(id) {
    const article = loadedArticles.find(a => a.id == id);
    if (!article) return;

    document.getElementById('edit-id').value = article.id;
    document.getElementById('edit-title').value = article.title;
    document.getElementById('edit-category').value = article.category;
    document.getElementById('edit-image_url').value = article.image_url || '';
    document.getElementById('edit-body').value = article.body;

    document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.style.display = 'none';
}

// Supprimer un article
async function deleteArticle(id) {
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;

    try {
        const res = await fetch('../api/delete_content.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const result = await res.json();
        if (result.status === 'success') {
            loadAdminArticles();
        } else {
            alert(result.message);
        }
    } catch (e) {
        alert("Erreur lors de la suppression.");
    }
}

// Messages et Stats
async function loadAdminMessages() {
    const listContainer = document.getElementById('messages-list');
    if (!listContainer) return;

    try {
        const res = await fetch('../api/get_messages.php');
        const result = await res.json();

        if (result.status === 'success' && result.data.length > 0) {
            listContainer.innerHTML = '';
            result.data.forEach(msg => {
                const item = document.createElement('div');
                item.style.backgroundColor = '#121212';
                item.style.padding = '1rem';
                item.style.marginBottom = '1rem';
                item.style.borderRadius = '6px';
                item.style.borderLeft = '3px solid var(--accent-color)';

                const dateFormatted = new Date(msg.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <strong>${msg.name} (${msg.email})</strong>
                        <small style="color: var(--text-muted);">${dateFormatted}</small>
                    </div>
                    <div style="font-weight: 600; color: var(--accent-color); margin-bottom: 0.4rem;">Sujet : ${msg.subject}</div>
                    <p style="color: var(--text-light); margin: 0; white-space: pre-line;">${msg.message}</p>
                `;
                listContainer.appendChild(item);
            });
        } else {
            listContainer.innerHTML = '<p style="color: var(--text-muted);">Aucun message reçu pour l\'instant.</p>';
        }
    } catch (e) {
        listContainer.innerHTML = '<p style="color: red;">Erreur lors du chargement des messages.</p>';
    }
}

async function loadAdminStats() {
    try {
        const res = await fetch('../api/get_stats.php');
        const result = await res.json();

        if (result.status === 'success') {
            const totalViews = document.getElementById('stat-total-views');
            const uniqueVisitors = document.getElementById('stat-unique-visitors');
            const todayViews = document.getElementById('stat-today-views');

            if (totalViews) totalViews.textContent = result.data.total_views;
            if (uniqueVisitors) uniqueVisitors.textContent = result.data.unique_visitors;
            if (todayViews) todayViews.textContent = result.data.today_views;
        }
    } catch (e) {
        console.error("Erreur lors du chargement des statistiques :", e);
    }
}