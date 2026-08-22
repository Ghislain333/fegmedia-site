<?php
// Configuration des accès à la base de données
$host = '127.0.0.1';
$port = '5432';
$db   = 'fegmedia';
$user = 'fegmedia_user';
$pass = 'fegmedia2026';

// Construction du DSN pour PostgreSQL
$dsn = "pgsql:host=$host;port=$port;dbname=$db";

try {
    // Création de l'instance PDO avec \PDO pour cibler l'espace global
    $pdo = new \PDO($dsn, $user, $pass, [
        \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
    ]);
} catch (\PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        "status"  => "error",
        "message" => "Erreur de connexion DB : " . $e->getMessage()
    ]);
    exit;
}
?>