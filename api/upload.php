<?php
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST'
    && ($_GET['action'] ?? '') === 'image'
    && isset($_FILES['image']))
{
    $file = $_FILES['image'];
    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/gif'  => 'gif',
        'image/webp' => 'webp'
    ];
    $maxSize = 5 * 1024 * 1024;
    $type = mime_content_type($file['tmp_name']);
    if (!in_array($type, array_keys($allowedTypes))) {
        http_response_code(400);
        echo json_encode(['success'=>false, 'message'=>'Invalid file type']);
        exit;
    }
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['success'=>false, 'message'=>'Max file size 5MB']);
        exit;
    }
    $ext = $allowedTypes[$type];
    $filename = uniqid('img_', true) . "." . $ext;
    $target = $uploadDir . $filename;
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        http_response_code(500);
        echo json_encode(['success'=>false,'message'=>'Failed to save file']);
        exit;
    }
    // Provide relative url, make sure /uploads is accessible from browser!
    $url = '/uploads/' . $filename;
    echo json_encode([
        'success'=> true,
        'message'=> 'Image uploaded',
        'data'=> ['image_url'=> $url],
        'url' => $url
    ]);
    exit;
}
echo json_encode(['success'=>false, 'message'=>'No file uploaded']);