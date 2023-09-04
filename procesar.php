<?php
$host = 'localhost';
$db   = 'fichamedica';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

$pdo = new PDO($dsn, $user, $pass, $options);

$action = $_POST['action'];

if ($action == 'save') {
    $data = $_POST;
    unset($data['action']);

    $sql = "INSERT INTO pacientes (".implode(',', array_keys($data)).") VALUES (:".implode(", :", array_keys($data)).") 
            ON DUPLICATE KEY UPDATE 
            rut=:rut_update,
            nombres=:nombres_update, 
            apellidos=:apellidos_update, 
            direccion=:direccion_update, 
            ciudad=:ciudad_update, 
            telefono=:telefono_update, 
            email=:email_update, 
            fechaNacimiento=:fechaNacimiento_update, 
            estadoCivil=:estadoCivil_update, 
            comentarios=:comentarios_update";

    // Duplicating the data with _update suffix for the ON DUPLICATE KEY UPDATE clause
    foreach ($data as $key => $value) {
        $data[$key . "_update"] = $value;
    }

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($data);
        echo "saved";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
} elseif ($action == 'search') {
    $rut = $_POST['rut'];

    $sql = "SELECT * FROM pacientes WHERE rut = :rut";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':rut', $rut, PDO::PARAM_STR);
    $stmt->execute();

    echo ($stmt->fetch()) ? "exists" : "not_exists";
}
?>
