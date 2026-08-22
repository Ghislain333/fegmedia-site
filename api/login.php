<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';

// Récupération des données JSON envoyées par la requête JS
$input = json_decode(file_get_contents('php://input'), true);

$email    = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Veuillez remplir tous les champs."]);
    exit;
}

try {
    // Recherche de l'admin en base de données
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch();

    // Vérification de l'existence et du mot de passe haché avec password_verify
    if ($admin && password_verify($password, $admin['password_hash'])) {
        // Enregistrement des données en session
        $_SESSION['admin_id']    = $admin['id'];
        $_SESSION['admin_email'] = $admin['email'];

        echo json_encode(["status" => "success", "message" => "Connexion réussie !"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Identifiants incorrects."]);
    }

} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur serveur : " . $e->getMessage()]);
}
?>