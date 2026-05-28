<?php
include 'config.php';

$action = $_GET['action'] ?? '';
$user_id = intval($_POST['user_id'] ?? $_GET['user_id'] ?? 0);

if ($action === 'add') {
    $product_id = intval($_POST['product_id'] ?? 0);

    if ($user_id <= 0 || $product_id <= 0) {
        echo response(false, 'Invalid parameters');
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1");
    $stmt->bind_param("ii", $user_id, $product_id);
    
    if ($stmt->execute()) {
        echo response(true, 'Added to cart');
    } else {
        echo response(false, 'Failed to add to cart');
    }
    $stmt->close();
}

elseif ($action === 'get') {
    if ($user_id <= 0) {
        echo response(false, 'Invalid user');
        exit;
    }

    $stmt = $conn->prepare("SELECT c.id, c.user_id, c.product_id, c.quantity, p.name, p.price, p.image FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $cart = [];
    
    while ($row = $result->fetch_assoc()) {
        // Ensure price is a number
        $row['price'] = floatval($row['price']);
        $row['quantity'] = intval($row['quantity']);
        $cart[] = $row;
    }
    
    echo response(true, 'Cart retrieved', $cart);
    $stmt->close();
}

elseif ($action === 'update') {
    $product_id = intval($_POST['product_id'] ?? 0);
    $quantity = intval($_POST['quantity'] ?? 1);

    if ($user_id <= 0 || $product_id <= 0 || $quantity < 0) {
        echo response(false, 'Invalid parameters');
        exit;
    }

    if ($quantity === 0) {
        // Delete if quantity is 0
        $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("ii", $user_id, $product_id);
    } else {
        $stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
        $stmt->bind_param("iii", $quantity, $user_id, $product_id);
    }
    
    if ($stmt->execute()) {
        echo response(true, 'Cart updated');
    } else {
        echo response(false, 'Failed to update cart');
    }
    $stmt->close();
}

elseif ($action === 'remove') {
    $product_id = intval($_POST['product_id'] ?? 0);

    if ($user_id <= 0 || $product_id <= 0) {
        echo response(false, 'Invalid parameters');
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
    $stmt->bind_param("ii", $user_id, $product_id);
    
    if ($stmt->execute()) {
        echo response(true, 'Removed from cart');
    } else {
        echo response(false, 'Failed to remove from cart');
    }
    $stmt->close();
}

elseif ($action === 'clear') {
    if ($user_id <= 0) {
        echo response(false, 'Invalid user');
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    
    if ($stmt->execute()) {
        echo response(true, 'Cart cleared');
    } else {
        echo response(false, 'Failed to clear cart');
    }
    $stmt->close();
}

$conn->close();
?>