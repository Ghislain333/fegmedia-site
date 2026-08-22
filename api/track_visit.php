<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';

$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$input = json_decode(file_get_contents('php://input'), true);
$page = trim($input['page'] ?? '/');

try {
    $stmt = $pdo->prepare("INSERT INTO visits (ip_address, page_url) VALUES (:ip, :page)");
    $stmt->execute([':ip' => $ip, ':page' => $page]);
    echo json_encode(["status" => "success"]);
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>