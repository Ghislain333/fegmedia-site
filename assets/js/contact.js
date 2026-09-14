import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://mqxtnvryhasoxqfrnmxk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_EyhsxGF8XLMUu0DcTXWzcQ_apjD27P9';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        const { error } = await supabase
            .from('messages')
            .insert([formData]);

        if (error) throw error;

        msgDiv.style.color = "#2ed573";
        msgDiv.textContent = "Message envoyé avec succès ! Nous vous répondrons bientôt.";
        document.getElementById('contact-form').reset();
        
    } catch (error) {
        console.error(error);
        msgDiv.style.color = "#ff4757";
        msgDiv.textContent = "Erreur lors de l'envoi du message.";
    }
});