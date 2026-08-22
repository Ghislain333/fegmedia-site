<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['admin_id'])) {
    echo json_encode([
        "status" => "success",
        "admin"  => [
            "id"    => $_SESSION['admin_id'],
            "email" => $_SESSION['admin_email']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Non autorisé"]);
}
?>