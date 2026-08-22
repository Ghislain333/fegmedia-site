<?php
// On indique au navigateur que la réponse est au format JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Autorise les requêtes de l'application

// Inclusion de la connexion à la base de données
require_once __DIR__ . '/../config/db.php';

try {
    // Requête SQL pour récupérer tous les articles du plus récent au plus ancien
    $sql = "SELECT c.id, c.title, c.category, c.image_url, c.body, c.published_at, a.email AS author 
            FROM contents c 
            LEFT JOIN admins a ON c.created_by = a.id 
            ORDER BY c.published_at DESC";

    $stmt = $pdo->query($sql);
    $articles = $stmt->fetchAll();

    // Retourne les données sous forme de tableau JSON
    echo json_encode([
        "status" => "success",
        "data"   => $articles
    ]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => "Erreur lors de la récupération des contenus : " . $e->getMessage()
    ]);
}
?>