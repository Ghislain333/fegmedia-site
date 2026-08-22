document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const msgDiv = document.getElementById('contact-msg');
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    msgDiv.style.color = "var(--text-muted)";
    msgDiv.textContent = "Envoi en cours...";

    try {
        const response = await fetch('api/send_message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            msgDiv.style.color = "#2ed573";
            msgDiv.textContent = result.message;
            document.getElementById('contact-form').reset();
        } else {
            msgDiv.style.color = "#ff4757";
            msgDiv.textContent = result.message;
        }
    } catch (error) {
        msgDiv.style.color = "#ff4757";
        msgDiv.textContent = "Erreur lors de l'envoi du message.";
    }
});