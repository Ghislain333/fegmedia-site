<?php
$host = 'mysql-fokou.alwaysdata.net';
$db   = 'fokou_admin';
$user = 'fokou'; // ton identifiant Alwaysdata
$pass = 'jjU_a82WpQT9L@z'; // le mot de passe de ton compte/base Alwaysdata

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur de connexion DB : " . $e->getMessage()]);
    exit;
}
?>