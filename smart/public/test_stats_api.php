<?php
// API endpoint testing script
echo "Testing dashboard API endpoints...\n";

// Test stats endpoint with no authentication
$testUrl = 'http://localhost:8000/api/stats-test';
echo "\n[1] Testing: $testUrl\n";

try {
    $context = stream_context_create([
        'http' => [
            'ignore_errors' => true
        ]
    ]);

    $response = file_get_contents($testUrl, false, $context);
    $httpcode = $http_response_header[0];

    echo "Response: $httpcode\n";

    if(strpos($httpcode, '200') !== false) {
        $data = json_decode($response, true);
        echo "Data received: \n";
        echo " - Total meetings: " . $data['total_meetings'] . "\n";
        echo " - Total commissions: " . $data['total_commissions'] . "\n";
        echo " - Active commissions: " . $data['active_commissions'] . "\n";
        echo " - Pending meetings: " . $data['pending_meetings'] . "\n";
        if(isset($data['data_source'])) {
            echo " - Data source: " . $data['data_source'] . "\n";
        }
    } else {
        echo "Error: $response\n";
    }
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}

// Test stats endpoint with authentication (you would need to replace the token)
$token = 'your_auth_token_here'; // Replace with a real token if you have one
$authUrl = 'http://localhost:8000/api/stats';
echo "\n[2] Testing: $authUrl (with authentication)\n";

try {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "Authorization: Bearer $token\r\n",
            'ignore_errors' => true
        ]
    ]);

    $response = file_get_contents($authUrl, false, $context);
    $httpcode = $http_response_header[0];

    echo "Response: $httpcode\n";

    if(strpos($httpcode, '200') !== false) {
        $data = json_decode($response, true);
        echo "Data received: \n";
        echo " - Total meetings: " . $data['total_meetings'] . "\n";
        echo " - Total commissions: " . $data['total_commissions'] . "\n";
        echo " - Active commissions: " . $data['active_commissions'] . "\n";
        echo " - Pending meetings: " . $data['pending_meetings'] . "\n";
        if(isset($data['data_source'])) {
            echo " - Data source: " . $data['data_source'] . "\n";
        }
        if(isset($data['auth_status'])) {
            echo " - Auth status: " . $data['auth_status'] . "\n";
        }
    } else {
        echo "Error: $response\n";
    }
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}

echo "\nTest completed. If you see errors above, please check Laravel logs.\n";
