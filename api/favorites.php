<?php
include 'config.php';

$action = $_GET['action'] ?? '';
$user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? 0;

if ($action === 'add') {
    $product_id = $_POST['product_id'] ?? 0;
    $stmt = $conn->prepare("INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();
    echo response(true, 'Added to favorites');
}

elseif ($action === 'remove') {
    $product_id = $_POST['product_id'] ?? 0;
    $stmt = $conn->prepare("DELETE FROM favorites WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param("ii", $user_id, $product_id);
    $stmt->execute();
    echo response(true, 'Removed from favorites');
}

elseif ($action === 'list') {
    $stmt = $conn->prepare("SELECT p.* FROM favorites f JOIN products p ON f.product_id = p.id WHERE f.user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $favorites = [];
    
    while ($row = $result->fetch_assoc()) {
        $favorites[] = $row;
    }
    
    echo response(true, 'Favorites retrieved', $favorites);
}

$conn->close();
?>