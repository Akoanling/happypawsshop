<?php
include 'config.php';

$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        echo response(false, 'Email and password required');
        exit;
    }

    // Try to find existing user (sign in should only work for registered accounts)
    $stmt = $conn->prepare("SELECT id, email, name FROM users WHERE email = ? AND password = ?");
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo response(true, 'Login successful', $user);
    } else {
        // Check if user exists but password is wrong
        $stmt2 = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt2->bind_param("s", $email);
        $stmt2->execute();

        if ($stmt2->get_result()->num_rows > 0) {
            echo response(false, 'Invalid password');
        } else {
            echo response(false, 'No account found for this email. Please create an account first.');
        }
        $stmt2->close();
    }
    $stmt->close();
}

elseif ($action === 'register') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $name = $_POST['name'] ?? explode('@', $email)[0];

    if (!$email || !$password) {
        echo response(false, 'Email and password required');
        exit;
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    if ($stmt->get_result()->num_rows > 0) {
        echo response(false, 'Email already exists. Please sign in or use another email.');
        $stmt->close();
        exit;
    }
    $stmt->close();

    // Create new user
    $stmt = $conn->prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $password, $name);

    if ($stmt->execute()) {
        $user = ['id' => $stmt->insert_id, 'email' => $email, 'name' => $name];
        echo response(true, 'Registration successful! Your account has been created.', $user);
    } else {
        echo response(false, 'Registration failed: ' . $conn->error);
    }
    $stmt->close();
}

$conn->close();
?>