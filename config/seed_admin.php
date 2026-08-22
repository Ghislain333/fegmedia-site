<?php
// Inclusion du fichier de connexion à la DB
require_once __DIR__ . '/db.php';

// Identifiants de l'administrateur
$email    = 'admin@fegmedia.cm';
$password = 'AdminFeg2026!'; // Mot de passe fort

// Hachage sécurisé du mot de passe avec Bcrypt
$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    // Requête préparée SQL contre les injections
    $sql = "INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)";
    $stmt = $pdo->prepare($sql);
    
    // Exécution avec attribution des valeurs
    $stmt->execute([
        ':email'         => $email,
        ':password_hash' => $password_hash
    ]);

    echo "✅ Compte administrateur créé avec succès !\n";
    echo "Email : " . $email . "\n";

} catch (\PDOException $e) {
    // Si l'admin existe déjà (contrainte UNIQUE sur l'email)
    if ($e->getCode() === '23505') {
        echo "⚠️ L'administrateur " . $email . " existe déjà dans la base.\n";
    } else {
        echo "❌ Erreur lors de la création : " . $e->getMessage() . "\n";
    }
}
?>