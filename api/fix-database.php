
<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$database = "happy_paw_shop";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

echo "<h1>🔧 Database Fix Tool</h1>";
echo "<hr>";

// ===== CHECK AND FIX PRODUCTS TABLE =====
echo "<h2>✓ Checking products table...</h2>";

// Check if stock column exists
$result = $conn->query("SHOW COLUMNS FROM products LIKE 'stock'");
if ($result->num_rows === 0) {
    echo "❌ Stock column missing! Adding it now...<br>";
    $sql = "ALTER TABLE products ADD COLUMN stock INT DEFAULT 0 AFTER reviews";
    if ($conn->query($sql)) {
        echo "✅ Stock column added successfully!<br>";
    } else {
        echo "❌ Error adding stock column: " . $conn->error . "<br>";
    }
} else {
    echo "✅ Stock column already exists<br>";
}

// Check if image_url column exists
$result = $conn->query("SHOW COLUMNS FROM products LIKE 'image_url'");
if ($result->num_rows === 0) {
    echo "❌ Image URL column missing! Adding it now...<br>";
    $sql = "ALTER TABLE products ADD COLUMN image_url VARCHAR(500) AFTER image";
    if ($conn->query($sql)) {
        echo "✅ Image URL column added successfully!<br>";
    } else {
        echo "❌ Error adding image_url column: " . $conn->error . "<br>";
    }
} else {
    echo "✅ Image URL column already exists<br>";
}

// ===== CHECK ORDERS TABLE =====
echo "<h2>✓ Checking orders table...</h2>";
$tables = $conn->query("SHOW TABLES LIKE 'orders'");
if ($tables->num_rows > 0) {
    echo "✅ Orders table exists<br>";
    
    // Check for updated_at column
    $result = $conn->query("SHOW COLUMNS FROM orders LIKE 'updated_at'");
    if ($result->num_rows === 0) {
        $sql = "ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP";
        if ($conn->query($sql)) {
            echo "✅ Updated_at column added<br>";
        }
    }
} else {
    echo "❌ Orders table missing! Creating...<br>";
    $sql = "CREATE TABLE orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) DEFAULT 0,
        shipping_cost DECIMAL(10, 2) DEFAULT 5,
        shipping_method VARCHAR(50) DEFAULT 'standard',
        status VARCHAR(50) DEFAULT 'processing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )";
    if ($conn->query($sql)) {
        echo "✅ Orders table created!<br>";
    } else {
        echo "❌ Error: " . $conn->error . "<br>";
    }
}

// ===== CHECK ORDER_ITEMS TABLE =====
echo "<h2>✓ Checking order_items table...</h2>";
$tables = $conn->query("SHOW TABLES LIKE 'order_items'");
if ($tables->num_rows > 0) {
    echo "✅ Order items table exists<br>";
} else {
    echo "❌ Order items table missing! Creating...<br>";
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
        echo "✅ Order items table created!<br>";
    } else {
        echo "❌ Error: " . $conn->error . "<br>";
    }
}

// ===== CHECK SHIPPING_INFO TABLE =====
echo "<h2>✓ Checking shipping_info table...</h2>";
$tables = $conn->query("SHOW TABLES LIKE 'shipping_info'");
if ($tables->num_rows > 0) {
    echo "✅ Shipping info table exists<br>";
} else {
    echo "❌ Shipping info table missing! Creating...<br>";
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
        echo "✅ Shipping info table created!<br>";
    } else {
        echo "❌ Error: " . $conn->error . "<br>";
    }
}

// ===== CHECK PRODUCTS STRUCTURE =====
echo "<h2>✓ Products table structure:</h2>";
$result = $conn->query("DESCRIBE products");
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['Field'] . "</td>";
    echo "<td>" . $row['Type'] . "</td>";
    echo "<td>" . ($row['Null'] === 'YES' ? 'Yes' : 'No') . "</td>";
    echo "<td>" . ($row['Key'] ?: '-') . "</td>";
    echo "<td>" . ($row['Default'] ?: '-') . "</td>";
    echo "</tr>";
}
echo "</table>";

// ===== TEST QUERY =====
echo "<h2>✓ Testing edit query...</h2>";
$test_id = 1;
$stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, original_price=?, discount=?, rating=?, reviews=?, stock=?, image_url=? WHERE id=?");

if ($stmt) {
    echo "✅ Prepared statement created successfully!<br>";
    $stmt->close();
} else {
    echo "❌ Error creating prepared statement: " . $conn->error . "<br>";
}

echo "<hr>";
echo "<h2>✅ Database fix complete!</h2>";
echo "<p>Go back to <a href='../admin.html'>Admin Panel</a> and try editing again.</p>";

$conn->close();
?>
