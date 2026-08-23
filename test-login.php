<?php
require_once __DIR__ . '/config/db.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = :email");
    $stmt->execute([':email' => 'admin@fegmedia.com']);
    $admin = $stmt->fetch();

    if ($admin) {
        echo "SUCCESS: Admin trouvé en base !<br>";
        echo "Email: " . $admin['email'] . "<br>";
        echo "Hash: " . $admin['password_hash'] . "<br>";

        if (password_verify('123456', $admin['password_hash'])) {
            echo "<br><b>VERIFICATION OK : Le mot de passe '123456' fonctionne !</b>";
        } else {
            echo "<br><b>VERIFICATION ECHOUEE : Le hash ne correspond pas au mot de passe.</b>";
        }
    } else {
        echo "ERREUR : Aucun admin trouvé par PHP avec cet email (la base connectée est peut-être vide ou différente).";
    }
} catch (\Exception $e) {
    echo "ERREUR DE CONNEXION : " . $e->getMessage();
}
?>