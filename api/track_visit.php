<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$page = $input['page'] ?? '/index.html';
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

try {
    $stmt = $pdo->prepare("INSERT INTO page_views (page, ip_address) VALUES (:page, :ip)");
    $stmt->execute([':page' => $page, ':ip' => $ip]);
    echo json_encode(["status" => "success"]);
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>