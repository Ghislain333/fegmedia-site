<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);

$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(["status" => "error", "message" => "Veuillez remplir tous les champs."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Adresse email invalide."]);
    exit;
}

try {
    $sql = "INSERT INTO contacts (name, email, subject, message) VALUES (:name, :email, :subject, :message)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name'    => $name,
        ':email'   => $email,
        ':subject' => $subject,
        ':message' => $message
    ]);

    echo json_encode(["status" => "success", "message" => "Votre message a bien été envoyé ! Nous vous répondrons sous 24h."]);

} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur lors de l'envoi du message : " . $e->getMessage()]);
}
?>