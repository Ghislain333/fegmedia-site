<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Non autorisé"]);
    exit;
}

require_once __DIR__ . '/../config/db.php';

try {
    // Total de pages vues
    $totalViews = $pdo->query("SELECT COUNT(*) FROM visits")->fetchColumn();

    // Visiteurs uniques (basé sur l'IP)
    $uniqueVisitors = $pdo->query("SELECT COUNT(DISTINCT ip_address) FROM visits")->fetchColumn();

    // Visites aujourd'hui
    $todayViews = $pdo->query("SELECT COUNT(*) FROM visits WHERE DATE(visited_at) = CURRENT_DATE")->fetchColumn();

    echo json_encode([
        "status" => "success",
        "data" => [
            "total_views" => $totalViews,
            "unique_visitors" => $uniqueVisitors,
            "today_views" => $todayViews
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>