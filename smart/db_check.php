<?php
// Database check script for Smart PFE project

// Import models at top level
use App\Models\Meeting;
use App\Models\Commission;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Load Laravel
require_once __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // Check database connection
    $conn = DB::connection();
    echo "Connected to database: " . $conn->getDatabaseName() . "\n";

    // Check model counts
    echo "\n--- MODEL COUNTS ---\n";
    echo "Users: " . User::count() . "\n";
    echo "Commissions: " . Commission::count() . "\n";
    echo "Meetings: " . Meeting::count() . "\n";

    // Check schema for commissions
    echo "\n--- COMMISSION SCHEMA ---\n";
    if (Schema::hasTable('commissions')) {
        foreach (Schema::getColumnListing('commissions') as $column) {
            echo "- $column\n";
        }
    } else {
        echo "Error: commissions table not found!\n";
    }

    // Check schema for meetings
    echo "\n--- MEETING SCHEMA ---\n";
    if (Schema::hasTable('meetings')) {
        foreach (Schema::getColumnListing('meetings') as $column) {
            echo "- $column\n";
        }
    } else {
        echo "Error: meetings table not found!\n";
    }

    // Check status fields
    echo "\n--- STATUS CHECKS ---\n";
    if (Schema::hasColumn('commissions', 'status')) {
        echo "Active Commissions: " . Commission::where('status', 'active')->count() . "\n";
    } else {
        echo "Error: Commissions table has no 'status' column\n";

        // Suggest fix if status column is missing
        echo "\nSUGGESTED FIX: Run migration to add status column to commissions table\n";
    }

    if (Schema::hasColumn('meetings', 'status')) {
        echo "Pending Meetings: " . Meeting::where('status', 'pending')->count() . "\n";
    } else {
        echo "Error: Meetings table has no 'status' column\n";

        // Suggest fix if status column is missing
        echo "\nSUGGESTED FIX: Run migration to add status column to meetings table\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " (Line: " . $e->getLine() . ")\n";
}
