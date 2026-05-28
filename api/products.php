<?php
include 'config.php';

$action = $_GET['action'] ?? 'list';

// Helper to save file if present and return URL
function handleUpload($field = 'image') {
    if (!isset($_FILES[$field])) return '';
    $ext = strtolower(pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png','gif','webp'];
    if (!in_array($ext, $allowed)) return '';
    $upDir = __DIR__ . '/../uploads/';
    if (!is_dir($upDir)) mkdir($upDir, 0777, true);
    $filename = uniqid('img_', true) . ".$ext";
    if (move_uploaded_file($_FILES[$field]['tmp_name'], $upDir.$filename)) {
        return "/uploads/$filename";
    }
    return '';
}

// --- Product List ---
if ($action === 'list') {
    $q = $conn->query("SELECT * FROM products ORDER BY id DESC");
    $products = [];
    while ($row = $q->fetch_assoc()) {
        $products[] = $row;
    }
    echo response(true, 'Products retrieved', $products);
}

// --- Product Add ---
elseif ($action === 'add') {
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = floatval($_POST['price'] ?? 0);
    $stock = intval($_POST['stock'] ?? 0);
    $image_url = handleUpload('image');

    if (!$name || !$category || $price <= 0) {
        echo response(false, 'Missing product data');
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO products (name, category, price, stock, image_url) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdis", $name, $category, $price, $stock, $image_url);
    $ok = $stmt->execute();
    echo response($ok, $ok ? 'Product added' : $stmt->error);
    $stmt->close();
}

// --- Product Edit ---
elseif ($action === 'edit') {
    $id = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    $name = $_POST['name'] ?? '';
    $category = $_POST['category'] ?? '';
    $price = floatval($_POST['price'] ?? 0);
    $stock = intval($_POST['stock'] ?? 0);

    // keep current image, or save new if present
    $cur = $conn->query("SELECT image_url FROM products WHERE id=$id")->fetch_assoc();
    $image_url = $cur ? $cur['image_url'] : '';
    $new_image_url = handleUpload('image');
    if ($new_image_url) {
        // remove old if set
        $disk = $_SERVER['DOCUMENT_ROOT'] . ($image_url ?? '');
        if ($image_url && @file_exists($disk)) @unlink($disk);
        $image_url = $new_image_url;
    }

    $stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, stock=?, image_url=? WHERE id=?");
    $stmt->bind_param("ssdisi", $name, $category, $price, $stock, $image_url, $id);
    $ok = $stmt->execute();
    echo response($ok, $ok ? 'Product updated' : $stmt->error);
    $stmt->close();
}

// --- Product Delete ---
elseif ($action === 'delete') {
    $id = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    if ($id > 0) {
        // delete actual file
        $p = $conn->query("SELECT image_url FROM products WHERE id=$id")->fetch_assoc();
        if ($p && $p['image_url']) {
            $disk = $_SERVER['DOCUMENT_ROOT'] . ($p['image_url'] ?? '');
            if ($disk && @file_exists($disk)) @unlink($disk);
        }
        $stmt = $conn->prepare("DELETE FROM products WHERE id=?");
        $stmt->bind_param("i", $id);
        $ok = $stmt->execute();
        echo response($ok, $ok ? 'Deleted' : $stmt->error);
        $stmt->close();
    } else {
        echo response(false, 'Missing id');
    }
} else {
    echo response(false, 'Unknown action');
}
$conn->close();