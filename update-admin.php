<?php
require_once __DIR__ . '/config/db.php';

$email = 'admin@fegmedia.com';
$password = '123456';
$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    // On supprime et on recrée proprement l'admin avec un hash 100% frais généré par PHP
    $pdo->exec("DELETE FROM admins");
    
    $stmt = $pdo->prepare("INSERT INTO admins (email, password_hash) VALUES (:email, :hash)");
    $stmt->execute([':email' => $email, ':hash' => $hash]);

    echo "SUCCÈS : Admin mis à jour avec un hash PHP natif !<br>";
    echo "Nouvel email : $email<br>";
    echo "Nouveau mot de passe : $password<br>";
    echo "Hash généré : $hash";
} catch (\Exception $e) {
    echo "Erreur : " . $e->getMessage();
}
?>