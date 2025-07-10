<?php
// Debug script to test authentication

// Output headers for debugging
header('Content-Type: application/json');

$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;
$bearerToken = null;

if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
    $bearerToken = substr($authHeader, 7);
}

echo json_encode([
    'headers' => $headers,
    'authorization_header' => $authHeader,
    'bearer_token' => $bearerToken ? substr($bearerToken, 0, 10) . '...' : null,
    'server' => $_SERVER,
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'timestamp' => date('Y-m-d H:i:s'),
], JSON_PRETTY_PRINT);
