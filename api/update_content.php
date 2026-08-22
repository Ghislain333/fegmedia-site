<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Non autorisé"]);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);

$id        = (int)($input['id'] ?? 0);
$title     = trim($input['title'] ?? '');
$category  = trim($input['category'] ?? '');
$image_url = trim($input['image_url'] ?? '');
$body      = trim($input['body'] ?? '');

if (!$id || empty($title) || empty($category) || empty($body)) {
    echo json_encode(["status" => "error", "message" => "Tous les champs obligatoires doivent être remplis."]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE contents SET title = :title, category = :category, image_url = :image_url, body = :body WHERE id = :id");
    $stmt->execute([
        ':title'     => $title,
        ':category'  => $category,
        ':image_url' => $image_url,
        ':body'      => $body,
        ':id'        => $id
    ]);

    echo json_encode(["status" => "success", "message" => "Article mis à jour avec succès !"]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur : " . $e->getMessage()]);
}
?>