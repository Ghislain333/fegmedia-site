import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://mqxtnvryhasoxqfrnmxk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EyhsxGF8XLMUu0DcTXWzcQ_apjD27P9';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let loadedArticles = [];

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Vérification de la session Admin via localStorage
    const adminSession = localStorage.getItem('fegmedia_admin');
    if (!adminSession) {
        window.location.href = 'login.html';
        return;
    }
    const adminData = JSON.parse(adminSession);
    const emailElem = document.getElementById('user-email');
    if (emailElem) emailElem.textContent = adminData.email;

    // 2. Chargements initiaux des données depuis Supabase
    loadAdminArticles();
    loadAdminMessages();
    loadAdminStats();
    loadAdminJobs();
    fetchSubscribersAdmin(); // <--- Appel de la fonction abonnés ici

    // 3. Soumission du formulaire de création d'article
    document.getElementById('create-article-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formMsg = document.getElementById('form-msg');
        const articleData = {
            title: document.getElementById('title').value,
            category: document.getElementById('category').value,
            image_url: document.getElementById('image_url').value,
            body: document.getElementById('body').value,
            published_at: new Date().toISOString()
        };

        try {
            const { error } = await supabase.from('contents').insert([articleData]);
            if (error) throw error;

            formMsg.style.color = '#2ed573';
            formMsg.textContent = 'Article publié avec succès !';
            document.getElementById('create-article-form').reset();
            loadAdminArticles();
        } catch (error) {
            console.error(error);
            formMsg.style.color = '#ff4757';
            formMsg.textContent = "Erreur lors de l'envoi.";
        }
    });

    // 4. Soumission du formulaire de création d'emploi
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
            const { error } = await supabase.from('jobs').insert([payload]);
            if (error) throw error;

            alert('Offre créée avec succès !');
            document.getElementById('add-job-form').reset();
            loadAdminJobs();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la publication.');
        }
    });
});

// Récupération des articles
async function loadAdminArticles() {
    const listContainer = document.getElementById('admin-articles-list');
    if (!listContainer) return;

    try {
        const { data: articles, error } = await supabase
            .from('contents')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        if (articles && articles.length > 0) {
            loadedArticles = articles;
            listContainer.innerHTML = '';
            articles.forEach(art => {
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

// Récupération des offres d'emploi
async function loadAdminJobs() {
    const container = document.getElementById('admin-jobs-list');
    if (!container) return;

    try {
        const { data: jobs, error } = await supabase.from('jobs').select('*').order('id', { ascending: false });
        if (error) throw error;

        if (jobs && jobs.length > 0) {
            container.innerHTML = '';
            jobs.forEach(job => {
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

// Suppression d'une offre
window.deleteJob = async function(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette offre ?')) return;
    try {
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        loadAdminJobs();
    } catch (err) {
        alert('Erreur lors de la suppression.');
    }
};

// Suppression d'un article
window.deleteArticle = async function(id) {
    if (!confirm('Voulez-vous vraiment supprimer cet article ?')) return;
    try {
        const { error } = await supabase.from('contents').delete().eq('id', id);
        if (error) throw error;
        loadAdminArticles();
    } catch (e) {
        alert("Erreur lors de la suppression.");
    }
};

async function loadAdminMessages() {
    const listContainer = document.getElementById('messages-list');
    if (!listContainer) return;
    try {
        const { data: messages, error } = await supabase.from('messages').select('*').order('id', { ascending: false });
        if (error) throw error;
        if (messages && messages.length > 0) {
            listContainer.innerHTML = '';
            messages.forEach(msg => {
                const item = document.createElement('div');
                item.style.backgroundColor = '#121212';
                item.style.padding = '1rem';
                item.style.marginBottom = '1rem';
                item.style.borderRadius = '6px';
                item.style.borderLeft = '3px solid var(--accent-color)';
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <strong>${msg.name} (${msg.email})</strong>
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
        const { data, error } = await supabase.rpc('get_visit_stats');
        if (error) throw error;

        if (data) {
            document.getElementById('stat-total-views').textContent = data.total_views || 0;
            document.getElementById('stat-unique-visitors').textContent = data.unique_visitors || 0;
            document.getElementById('stat-today-views').textContent = data.today_views || 0;
        }
    } catch (e) {
        console.error("Erreur stats :", e);
    }
} // <--- Accolade fermante bien placée ici

// Fonction pour récupérer et afficher les abonnés dans le dashboard admin
async function fetchSubscribersAdmin() {
    const tbody = document.getElementById('subscribers-table-body');
    if (!tbody) return;

    try {
        const { data: subscribers, error } = await supabase
            .from('subscribers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (subscribers && subscribers.length > 0) {
            tbody.innerHTML = '';
            subscribers.forEach(sub => {
                const dateFormatted = new Date(sub.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                tr.innerHTML = `
                    <td style="padding: 1rem; color: #fff; font-size: 0.9rem;">${sub.email}</td>
                    <td style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">${dateFormatted}</td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="2" style="padding: 1rem; color: var(--text-muted); text-align: center;">Aucun abonné pour le moment.</td></tr>`;
        }
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="2" style="padding: 1rem; color: #ff4757; text-align: center;">Erreur lors du chargement des abonnés.</td></tr>`;
    }
}