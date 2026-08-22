document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const alertMsg = document.getElementById('alert-msg');

    alertMsg.textContent = "Vérification en cours...";
    alertMsg.style.color = "var(--text-muted)";

    try {
        const response = await fetch('../api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alertMsg.style.color = '#2ed573';
            alertMsg.textContent = result.message;
            // Redirection vers le dashboard admin (qu'on va créer juste après)
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            alertMsg.style.color = '#ff4757';
            alertMsg.textContent = result.message;
        }

    } catch (error) {
        alertMsg.style.color = '#ff4757';
        alertMsg.textContent = "Erreur de connexion au serveur.";
    }
});