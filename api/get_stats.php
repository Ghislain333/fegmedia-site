<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

try {
    // Total des vues
    $total_views = $pdo->query("SELECT COUNT(*) FROM page_views")->fetchColumn();
    
    // Visiteurs uniques (basé sur l'IP)
    $unique_visitors = $pdo->query("SELECT COUNT(DISTINCT ip_address) FROM page_views")->fetchColumn();
    
    // Vues d'aujourd'hui
    $today_views = $pdo->query("SELECT COUNT(*) FROM page_views WHERE DATE(visited_at) = CURRENT_DATE")->fetchColumn();

    echo json_encode([
        "status" => "success",
        "data" => [
            "total_views" => (int)$total_views,
            "unique_visitors" => (int)$unique_visitors,
            "today_views" => (int)$today_views
        ]
    ]);
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>