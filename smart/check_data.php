<?php
// filepath: c:\Users\amine\Desktop\projet pfe\smart\check_data.php

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "laravel";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully to database\n";

// Function to print results in a formatted way
function printResults($result, $tableName) {
    echo "\n===== " . strtoupper($tableName) . " TABLE =====\n";

    if ($result->num_rows > 0) {
        echo "Found " . $result->num_rows . " records:\n\n";

        // Get field names
        $fields = $result->fetch_fields();
        $fieldNames = [];
        foreach ($fields as $field) {
            $fieldNames[] = $field->name;
            echo str_pad($field->name, 25) . " | ";
        }
        echo "\n" . str_repeat("-", count($fieldNames) * 28) . "\n";

        // Reset result pointer
        $result->data_seek(0);

        // Print rows
        while($row = $result->fetch_assoc()) {
            foreach ($row as $key => $value) {
                echo str_pad(substr($value, 0, 23), 25) . " | ";
            }
            echo "\n";
        }
    } else {
        echo "No records found\n";
    }
    echo "\n";
}

// Check commissions
echo "Checking commissions table...\n";
$sql = "SELECT id, name, description, created_at, updated_at FROM commissions";
$result = $conn->query($sql);
printResults($result, 'commissions');

// Check meetings
echo "Checking meetings table...\n";
$sql = "SELECT id, title, description, commission_id, date, time, participant_count, created_at, updated_at FROM meetings";
$result = $conn->query($sql);
printResults($result, 'meetings');

// Check meeting participants
echo "Checking meeting_participants table...\n";
$sql = "SELECT * FROM meeting_participants LIMIT 5";
$result = $conn->query($sql);
printResults($result, 'meeting_participants');

// Close connection
$conn->close();
