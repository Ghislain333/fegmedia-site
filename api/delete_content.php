<?php
session_start();
header('Content-Type: application/json');

// Vérification de l'authentification
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Accès non autorisé."]);
    exit;
}

require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

if (!$id) {
    echo json_encode(["status" => "error", "message" => "ID d'article manquant."]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM contents WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(["status" => "success", "message" => "Article supprimé avec succès."]);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur lors de la suppression : " . $e->getMessage()]);
}
?>