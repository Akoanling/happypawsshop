<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

try {
    include 'config.php';
    
    $action = $_GET['action'] ?? '';
    $user_id = intval($_POST['user_id'] ?? $_GET['user_id'] ?? 0);

    // CREATE ORDER
    if ($action === 'create') {
        
        if ($user_id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
            exit;
        }

        $total = floatval($_POST['total'] ?? 0);
        $tax = floatval($_POST['tax'] ?? 0);
        $shipping_cost = floatval($_POST['shipping_cost'] ?? 5);
        $shipping_method = trim($_POST['shipping_method'] ?? 'standard');
        
        if ($total <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid order total']);
            exit;
        }

        $order_number = 'ORD' . date('YmdHis') . rand(100, 999);

        // Insert order
        $total_clean = number_format($total, 2, '.', '');
        $tax_clean = number_format($tax, 2, '.', '');
        $shipping_clean = number_format($shipping_cost, 2, '.', '');
        
        $sql = "INSERT INTO orders (order_number, user_id, total, tax, shipping_cost, shipping_method, status) 
                VALUES ('{$order_number}', {$user_id}, {$total_clean}, {$tax_clean}, {$shipping_clean}, '{$shipping_method}', 'processing')";

        if (!$conn->query($sql)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Order insert failed: ' . $conn->error]);
            exit;
        }

        $order_id = $conn->insert_id;

        // Insert shipping info
        $first_name = $conn->real_escape_string($_POST['first_name'] ?? 'Customer');
        $last_name = $conn->real_escape_string($_POST['last_name'] ?? '');
        $email = $conn->real_escape_string($_POST['email'] ?? '');
        $phone = $conn->real_escape_string($_POST['phone'] ?? '');
        $address = $conn->real_escape_string($_POST['address'] ?? '');
        $city = $conn->real_escape_string($_POST['city'] ?? '');
        $state = $conn->real_escape_string($_POST['state'] ?? '');
        $zip = $conn->real_escape_string($_POST['zip'] ?? '');
        $country = $conn->real_escape_string($_POST['country'] ?? '');

        $sql2 = "INSERT INTO shipping_info (order_id, first_name, last_name, email, phone, address, city, state, zip, country) 
                 VALUES ({$order_id}, '{$first_name}', '{$last_name}', '{$email}', '{$phone}', '{$address}', '{$city}', '{$state}', '{$zip}', '{$country}')";

        $conn->query($sql2);

       // Get cart items and reduce stock
$sql3 = "SELECT c.product_id, c.quantity, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = {$user_id}";
$result = $conn->query($sql3);

if (!$result || $result->num_rows === 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Your cart is empty. Cannot create order.'
    ]);
    exit;
}

while ($row = $result->fetch_assoc()) {
    $product_id = intval($row['product_id']);
    $quantity = intval($row['quantity']);
    $price = floatval($row['price']);
    $item_total = $price * $quantity;
    $item_total_clean = number_format($item_total, 2, '.', '');
    $price_clean = number_format($price, 2, '.', '');

    // Insert order item
    $sql4 = "INSERT INTO order_items (order_id, product_id, quantity, price, item_total) 
             VALUES ({$order_id}, {$product_id}, {$quantity}, {$price_clean}, {$item_total_clean})";
    $conn->query($sql4);

    // REDUCE PRODUCT STOCK
    $sql_reduce = "UPDATE products SET stock = stock - {$quantity} WHERE id = {$product_id} AND stock >= {$quantity}";
    $conn->query($sql_reduce);
}
        // Clear cart
        $conn->query("DELETE FROM cart WHERE user_id = {$user_id}");

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => [
                'order_id' => $order_id,
                'order_number' => $order_number
            ]
        ]);
        exit;
    }

    // LIST ORDERS
    elseif ($action === 'list') {
        if ($user_id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid user']);
            exit;
        }

        $sql = "SELECT * FROM orders WHERE user_id = {$user_id} ORDER BY created_at DESC";
        $result = $conn->query($sql);
        $orders = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Orders retrieved',
            'data' => $orders
        ]);
        exit;
    }

    // CANCEL ORDER
    elseif ($action === 'cancel') {
        $order_id = intval($_POST['order_id'] ?? 0);

        if ($order_id <= 0 || $user_id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
            exit;
        }

        // Check order belongs to user and can be cancelled
        $sql = "SELECT status FROM orders WHERE id = {$order_id} AND user_id = {$user_id}";
        $result = $conn->query($sql);

        if ($result->num_rows === 0) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            exit;
        }

        $order = $result->fetch_assoc();

        // Only allow cancelling processing or pending orders
        if (!in_array($order['status'], ['processing', 'pending'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Cannot cancel ' . $order['status'] . ' orders']);
            exit;
        }

        // Get order items to restore stock
        $sql_items = "SELECT product_id, quantity FROM order_items WHERE order_id = {$order_id}";
        $result_items = $conn->query($sql_items);

        if ($result_items) {
            while ($item = $result_items->fetch_assoc()) {
                $product_id = intval($item['product_id']);
                $quantity = intval($item['quantity']);
                
                // RESTORE PRODUCT STOCK
                $sql_restore = "UPDATE products SET stock = stock + {$quantity} WHERE id = {$product_id}";
                $conn->query($sql_restore);
            }
        }

        // Update order status to cancelled
        $sql_cancel = "UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = {$order_id}";

        if ($conn->query($sql_cancel)) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Order cancelled successfully. Stock restored! ✅'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Cancel failed']);
        }
        exit;
    }

    // Invalid action
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Exception: ' . $e->getMessage()
    ]);
    exit;
}


?>