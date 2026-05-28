<?php
// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/../logs/error.log');

// Output JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection (edit to match your setup)
$servername = "localhost";
$username = "root";
$password = "";
$database = "happy_paw_shop";
$conn = new mysqli($servername, $username, $password, $database);

// Error handling
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => 'Database error: '.$conn->connect_error]));
}

$conn->set_charset("utf8mb4");

// Clean JSON response
function response($success, $message = '', $data = null) {
    $resp = ['success' => $success, 'message' => $message];
    if ($data !== null) $resp['data'] = $data;
    return json_encode($resp);
}
?>