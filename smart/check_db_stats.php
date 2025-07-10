<?php
// Basic script to check if the database has records

// Load Laravel
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // Import models
    use App\Models\Meeting;
    use App\Models\Commission;
    use App\Models\User;

    // Check if tables exist
    echo "Checking database connection...\n";
    $conn = DB::connection();
    echo "Database connected: " . $conn->getDatabaseName() . "\n\n";

    // Check if tables exist
    echo "Tables in database:\n";
    $tables = DB::select('SHOW TABLES');
    foreach ($tables as $table) {
        foreach ($table as $key => $value)
            echo "- $value\n";
    }

    // Check counts
    echo "\n=== Database Record Count Check ===\n";
    echo "Meetings: " . Meeting::count() . "\n";
    echo "Commissions: " . Commission::count() . "\n";
    echo "Users: " . User::count() . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " (Line: " . $e->getLine() . ")\n";
}
