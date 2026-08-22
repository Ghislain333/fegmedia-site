<?php
session_start();
header('Content-Type: application/json');

// Sécurité : Vérifie que l'utilisateur est connecté
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Accès non autorisé."]);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);

$title     = trim($input['title'] ?? '');
$category  = trim($input['category'] ?? '');
$image_url = trim($input['image_url'] ?? '');
$body      = trim($input['body'] ?? '');

if (empty($title) || empty($category) || empty($body)) {
    echo json_encode(["status" => "error", "message" => "Veuillez remplir tous les champs obligatoires."]);
    exit;
}

try {
    $sql = "INSERT INTO contents (title, category, image_url, body, created_by) 
            VALUES (:title, :category, :image_url, :body, :created_by)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':title'     => $title,
        ':category'  => $category,
        ':image_url' => $image_url,
        ':body'      => $body,
        ':created_by'=> $_SESSION['admin_id']
    ]);

    echo json_encode(["status" => "success", "message" => "Article publié avec succès !"]);

} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur lors de la publication : " . $e->getMessage()]);
}
?>