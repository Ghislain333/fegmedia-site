document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // Empêche la page de se recharger

            // Récupère les valeurs (ajuste les sélecteurs si tes champs ont des IDs spécifiques)
            const email = document.querySelector('input[type="email"], input[name="email"]').value;
            const password = document.querySelector('input[type="password"], input[name="password"]').value;

            try {
                // Modifie le chemin si ton login.php est dans un autre dossier (ex: '../api/login.php')
                const response = await fetch('login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();

                if (data.status === "success") {
                    alert("Connexion réussie !");
                    // Remplace "dashboard.html" par le vrai nom de ta page admin
                    window.location.href = "dashboard.html"; 
                } else {
                    alert("Erreur : " + data.message);
                }
            } catch (error) {
                console.error("Erreur de requête :", error);
                alert("Erreur de connexion au serveur.");
            }
        });
    }
});