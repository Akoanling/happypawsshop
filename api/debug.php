<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>🔍 Debug Info</h1>";

// Test 1: Config file
echo "<h2>✓ Testing config.php...</h2>";
try {
    include 'config.php';
    echo "✓ Config loaded successfully<br>";
    echo "✓ Database connected<br>";
} catch (Exception $e) {
    echo "✗ Config error: " . $e->getMessage() . "<br>";
}

// Test 2: Orders table
echo "<h2>✓ Checking orders table...</h2>";
$tables = $conn->query("SHOW TABLES LIKE 'orders'");
if ($tables->num_rows > 0) {
    echo "✓ Orders table exists<br>";
    $result = $conn->query("DESCRIBE orders");
    echo "<table border='1'><tr><th>Field</th><th>Type</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr><td>" . $row['Field'] . "</td><td>" . $row['Type'] . "</td></tr>";
    }
    echo "</table>";
} else {
    echo "✗ Orders table missing!<br>";
}

// Test 3: Order items table
echo "<h2>✓ Checking order_items table...</h2>";
$tables = $conn->query("SHOW TABLES LIKE 'order_items'");
if ($tables->num_rows > 0) {
    echo "✓ Order items table exists<br>";
} else {
    echo "✗ Order items table missing! Creating...<br>";
    $sql = "CREATE TABLE order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        item_total DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )";
    if ($conn->query($sql)) {
        echo "✓ Order items table created!<br>";
    } else {
        echo "✗ Error creating table: " . $conn->error . "<br>";
    }
}

// Test 4: Shipping info table
echo "<h2>✓ Checking shipping_info table...</h2>";
$tables = $conn->query("SHOW TABLES LIKE 'shipping_info'");
if ($tables->num_rows > 0) {
    echo "✓ Shipping info table exists<br>";
} else {
    echo "✗ Shipping info table missing! Creating...<br>";
    $sql = "CREATE TABLE shipping_info (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255),
        phone VARCHAR(20),
        address VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        zip VARCHAR(20),
        country VARCHAR(100),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )";
    if ($conn->query($sql)) {
        echo "✓ Shipping info table created!<br>";
    } else {
        echo "✗ Error creating table: " . $conn->error . "<br>";
    }
}

// Test 5: Sample order creation
echo "<h2>✓ Testing order creation...</h2>";
try {
    $test_user_id = 1;
    $test_order_num = "TEST_" . time();
    $test_total = 99.99;
    $test_tax = 10.0;
    $test_shipping = 5.0;

    $stmt = $conn->prepare("INSERT INTO orders (order_number, user_id, total, tax, shipping_cost, status) VALUES (?, ?, ?, ?, ?, 'processing')");
    $stmt->bind_param("sidds", $test_order_num, $test_user_id, $test_total, $test_tax, $test_shipping);
    
    if ($stmt->execute()) {
        echo "✓ Test order created successfully!<br>";
        echo "✓ Order ID: " . $stmt->insert_id . "<br>";
        
        // Delete test order
        $conn->query("DELETE FROM orders WHERE order_number = '$test_order_num'");
    } else {
        echo "✗ Error: " . $stmt->error . "<br>";
    }
    $stmt->close();
} catch (Exception $e) {
    echo "✗ Exception: " . $e->getMessage() . "<br>";
}

echo "<h2>✓ All tests complete!</h2>";
$conn->close();
?>