<?php
require_once __DIR__ . '/config/db.php';

// Mets ici ton VRAI email et ton NOUVEAU mot de passe sécurisé
$email = 'admin@fegmedia.com';
$nouveau_mdp = 'Excellence@'; 

$hash = password_hash($nouveau_mdp, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("UPDATE admins SET password_hash = :hash WHERE email = :email");
$stmt->execute([':hash' => $hash, ':email' => $email]);

echo "Mot de passe mis à jour avec succès pour : " . $email;
?>