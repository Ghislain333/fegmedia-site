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

$title               = trim($input['title'] ?? '');
$company             = trim($input['company'] ?? '');
$location            = trim($input['location'] ?? '');
$type                = trim($input['type'] ?? 'Temps plein');
$category            = trim($input['category'] ?? 'Tech');
$description         = trim($input['description'] ?? '');
$apply_url_or_email  = trim($input['apply_url_or_email'] ?? '');

if (empty($title) || empty($company) || empty($location) || empty($description) || empty($apply_url_or_email)) {
    echo json_encode(["status" => "error", "message" => "Veuillez remplir tous les champs requis."]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO jobs (title, company, location, type, category, description, apply_url_or_email) 
                           VALUES (:title, :company, :location, :type, :category, :description, :apply)");
    $stmt->execute([
        ':title'       => $title,
        ':company'     => $company,
        ':location'    => $location,
        ':type'        => $type,
        ':category'    => $category,
        ':description' => $description,
        ':apply'       => $apply_url_or_email
    ]);

    echo json_encode(["status" => "success", "message" => "Offre d'emploi publiée avec succès !"]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>