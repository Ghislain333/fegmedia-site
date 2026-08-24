<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$page = $input['page'] ?? '/index.html';

// Récupération de la vraie IP derrière le proxy de Render (X-Forwarded-For)
$ip = '0.0.0.0';
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $ip = trim($ips[0]);
} elseif (!empty($_SERVER['REMOTE_ADDR'])) {
    $ip = $_SERVER['REMOTE_ADDR'];
}

try {
    // Vérifier si cette IP a déjà visité cette page aujourd'hui (pour éviter les doublons de vues)
    $checkStmt = $pdo->prepare("SELECT id FROM page_views WHERE page = :page AND ip_address = :ip AND DATE(visited_at) = CURRENT_DATE");
    $checkStmt->execute([':page' => $page, ':ip' => $ip]);
    
    if ($checkStmt->rowCount() === 0) {
        // Si aucune visite enregistrée aujourd'hui pour cette IP sur cette page, on l'ajoute
        $stmt = $pdo->prepare("INSERT INTO page_views (page, ip_address, visited_at) VALUES (:page, :ip, NOW())");
        $stmt->execute([':page' => $page, ':ip' => $ip]);
    }

    echo json_encode(["status" => "success"]);
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>