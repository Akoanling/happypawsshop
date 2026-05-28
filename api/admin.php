<?php
include 'config.php';

// Hardcoded admin credentials (in production, use proper database authentication)
define('ADMIN_EMAIL', 'admin@happypaw.com');
define('ADMIN_PASSWORD', 'admin123');
define('ADMIN_ROLE', 'admin');

$action = $_GET['action'] ?? '';

// ===== ADMIN LOGIN =====
if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        echo response(false, 'Email and password required');
        exit;
    }

    // Check admin credentials
    if ($email === ADMIN_EMAIL && $password === ADMIN_PASSWORD) {
        $admin = [
            'id' => 'admin_001',
            'email' => ADMIN_EMAIL,
            'name' => 'Admin',
            'role' => ADMIN_ROLE
        ];
        echo response(true, 'Admin login successful', $admin);
    } else {
        echo response(false, 'Invalid admin credentials');
    }
    exit;
}

// ===== VERIFY ADMIN TOKEN =====
elseif ($action === 'verify') {
    $admin_id = $_GET['admin_id'] ?? '';
    
    if ($admin_id === 'admin_001') {
        echo response(true, 'Admin verified', ['role' => ADMIN_ROLE]);
    } else {
        echo response(false, 'Invalid admin token');
    }
    exit;
}

// ===== GET DASHBOARD STATS =====
elseif ($action === 'stats') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    // Get stats
    $total_products = $conn->query("SELECT COUNT(*) as count FROM products")->fetch_assoc()['count'];
    $total_orders = $conn->query("SELECT COUNT(*) as count FROM orders")->fetch_assoc()['count'];
    $total_users = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
    $total_revenue = $conn->query("SELECT SUM(total) as sum FROM orders")->fetch_assoc()['sum'] ?? 0;
    
    echo response(true, 'Stats retrieved', [
        'total_products' => $total_products,
        'total_orders' => $total_orders,
        'total_users' => $total_users,
        'total_revenue' => floatval($total_revenue)
    ]);
    exit;
}

// ===== GET ALL USERS =====
elseif ($action === 'users') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $result = $conn->query("SELECT id, email, name, created_at FROM users ORDER BY created_at DESC");
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo response(true, 'Users retrieved', $users);
    exit;
}

// ===== GET ALL ORDERS WITH DETAILS =====
elseif ($action === 'orders') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $result = $conn->query("SELECT o.*, u.email, u.name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC");
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo response(true, 'Orders retrieved', $orders);
    exit;
}

// ===== UPDATE ORDER STATUS =====
elseif ($action === 'update_order') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $order_id = intval($_POST['order_id'] ?? 0);
    $status = $_POST['status'] ?? '';

    if ($order_id <= 0 || !in_array($status, ['processing', 'shipped', 'delivered', 'cancelled'])) {
        echo response(false, 'Invalid parameters');
        exit;
    }

    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $order_id);

    if ($stmt->execute()) {
        echo response(true, 'Order status updated');
    } else {
        echo response(false, 'Update failed');
    }
    $stmt->close();
    exit;
}

// ===== DELETE USER =====
elseif ($action === 'delete_user') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $user_id = intval($_POST['user_id'] ?? 0);

    if ($user_id <= 0) {
        echo response(false, 'Invalid user ID');
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        echo response(true, 'User deleted');
    } else {
        echo response(false, 'Delete failed');
    }
    $stmt->close();
    exit;
}

echo response(false, 'Invalid action');
$conn->close();
?>
<?php
include 'config.php';

// Hardcoded admin credentials (in production, use proper database authentication)
define('ADMIN_EMAIL', 'admin@happypaw.com');
define('ADMIN_PASSWORD', 'admin123');
define('ADMIN_ROLE', 'admin');

$action = $_GET['action'] ?? '';

// ===== ADMIN LOGIN =====
if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        echo response(false, 'Email and password required');
        exit;
    }

    // Check admin credentials
    if ($email === ADMIN_EMAIL && $password === ADMIN_PASSWORD) {
        $admin = [
            'id' => 'admin_001',
            'email' => ADMIN_EMAIL,
            'name' => 'Admin',
            'role' => ADMIN_ROLE
        ];
        echo response(true, 'Admin login successful', $admin);
    } else {
        echo response(false, 'Invalid admin credentials');
    }
    exit;
}

// ===== VERIFY ADMIN TOKEN =====
elseif ($action === 'verify') {
    $admin_id = $_GET['admin_id'] ?? '';
    
    if ($admin_id === 'admin_001') {
        echo response(true, 'Admin verified', ['role' => ADMIN_ROLE]);
    } else {
        echo response(false, 'Invalid admin token');
    }
    exit;
}

// ===== GET DASHBOARD STATS =====
elseif ($action === 'stats') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    // Get stats
    $total_products = $conn->query("SELECT COUNT(*) as count FROM products")->fetch_assoc()['count'];
    $total_orders = $conn->query("SELECT COUNT(*) as count FROM orders")->fetch_assoc()['count'];
    $total_users = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
    $total_revenue = $conn->query("SELECT SUM(total) as sum FROM orders")->fetch_assoc()['sum'] ?? 0;
    
    echo response(true, 'Stats retrieved', [
        'total_products' => $total_products,
        'total_orders' => $total_orders,
        'total_users' => $total_users,
        'total_revenue' => floatval($total_revenue)
    ]);
    exit;
}

// ===== GET ALL USERS =====
elseif ($action === 'users') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $result = $conn->query("SELECT id, email, name, created_at FROM users ORDER BY created_at DESC");
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo response(true, 'Users retrieved', $users);
    exit;
}

// ===== GET ALL ORDERS WITH DETAILS =====
elseif ($action === 'orders') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $result = $conn->query("SELECT o.*, u.email, u.name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC");
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo response(true, 'Orders retrieved', $orders);
    exit;
}

// ===== UPDATE ORDER STATUS =====
elseif ($action === 'update_order') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $order_id = intval($_POST['order_id'] ?? 0);
    $status = $_POST['status'] ?? '';

    if ($order_id <= 0 || !in_array($status, ['processing', 'shipped', 'delivered', 'cancelled'])) {
        echo response(false, 'Invalid parameters');
        exit;
    }

    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $order_id);

    if ($stmt->execute()) {
        echo response(true, 'Order status updated');
    } else {
        echo response(false, 'Update failed');
    }
    $stmt->close();
    exit;
}

// ===== DELETE USER =====
elseif ($action === 'delete_user') {
    // Verify admin
    $admin_id = $_GET['admin_id'] ?? '';
    if ($admin_id !== 'admin_001') {
        http_response_code(403);
        echo response(false, 'Unauthorized');
        exit;
    }

    $user_id = intval($_POST['user_id'] ?? 0);

    if ($user_id <= 0) {
        echo response(false, 'Invalid user ID');
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        echo response(true, 'User deleted');
    } else {
        echo response(false, 'Delete failed');
    }
    $stmt->close();
    exit;
}

echo response(false, 'Invalid action');
$conn->close();
?>
