<?php
/**
 * Notification System Test Script
 *
 * USAGE:
 * ------
 * Run this script from the command line: php test_notifications.php
 *
 * SETUP SCHEDULER:
 * ---------------
 * On Windows: Run setup-scheduler.ps1 as Administrator
 * On Linux/Mac: Run bash setup-scheduler.sh
 *
 * For production environments, see DEPLOYMENT.md for Supervisor setup
 */

use Illuminate\Foundation\Application;
use Illuminate\Database\Eloquent\Collection;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing Notifications System\n";
echo "===========================\n\n";

// Helper function to print info
function printInfo($message) {
    echo "👉 {$message}\n";
}

// 1. Test meeting today notifications
function testMeetingTodayNotifications() {
    printInfo("Testing Meeting Today Notifications");

    // Find a meeting scheduled for today
    $today = \Carbon\Carbon::today()->toDateString();
    $meeting = \App\Models\Meeting::whereDate('date', $today)->first();

    if (!$meeting) {
        // Create a test meeting for today if none exists
        printInfo("  No meetings found for today, creating a test meeting");

        // Find a commission to attach the meeting to
        $commission = \App\Models\Commission::first();

        if (!$commission) {
            echo "  ❌ Error: No commissions found in the database\n";
            return false;
        }

        $meeting = new \App\Models\Meeting();
        $meeting->title = "Test Meeting for Notifications";
        $meeting->description = "This is a test meeting created to test notifications";
        $meeting->commission_id = $commission->id;
        $meeting->date = $today;
        $meeting->time = '14:00:00';
        $meeting->participant_count = 0;
        $meeting->status = 'pending';
        $meeting->save();

        printInfo("  Created test meeting: {$meeting->title} (ID: {$meeting->id})");
    } else {
        printInfo("  Found existing meeting for today: {$meeting->title} (ID: {$meeting->id})");
    }

    // Run the notification command
    \Illuminate\Support\Facades\Artisan::call('app:notify-today-meetings');

    // Get the output
    $output = \Illuminate\Support\Facades\Artisan::output();

    echo "  Command output:\n";
    echo "  ------------------------------\n";
    echo $output;
    echo "  ------------------------------\n";

    return true;
}

// 2. Test order of day notifications
function testOrderOfDayNotifications() {
    printInfo("Testing Order of Day Notifications");

    // Find a commission to update
    $commission = \App\Models\Commission::whereNotNull('order_of_day')->first();

    if (!$commission) {
        // Try to find any commission
        $commission = \App\Models\Commission::first();

        if (!$commission) {
            echo "  ❌ Error: No commissions found in the database\n";
            return false;
        }

        // Add an order of day if it doesn't exist
        $commission->order_of_day = "Original order of day for testing";
        $commission->save();

        printInfo("  Added order of day to commission: {$commission->name} (ID: {$commission->id})");
    }

    // Update order of day to trigger notification
    $oldOrderOfDay = $commission->order_of_day;
    $commission->order_of_day = "Updated order of day for testing notifications - " . date('Y-m-d H:i:s');
    $commission->save();

    printInfo("  Updated order of day for commission: {$commission->name} (ID: {$commission->id})");
    printInfo("  Old order of day: {$oldOrderOfDay}");
    printInfo("  New order of day: {$commission->order_of_day}");

    // Run the notification command
    \Illuminate\Support\Facades\Artisan::call('app:notify-order-of-day-changed');

    // Get the output
    $output = \Illuminate\Support\Facades\Artisan::output();

    echo "  Command output:\n";
    echo "  ------------------------------\n";
    echo $output;
    echo "  ------------------------------\n";

    return true;
}

// 3. Check notification database
function checkNotificationDatabase() {
    printInfo("Checking Notification Database");

    $notificationCount = \DB::table('notifications')->count();
    printInfo("  Total notifications in database: {$notificationCount}");

    if ($notificationCount > 0) {
        $notifications = \DB::table('notifications')->orderBy('created_at', 'desc')->limit(5)->get();

        echo "  Latest notifications:\n";
        foreach ($notifications as $notification) {
            $data = json_decode($notification->data);
            $type = class_basename($notification->type);
            echo "  - {$type} (sent " . \Carbon\Carbon::parse($notification->created_at)->diffForHumans() . ")\n";
            echo "    To: Notifiable ID {$notification->notifiable_id}\n";
            if (isset($data->message)) {
                echo "    Message: {$data->message}\n";
            }
        }
    } else {
        echo "  ℹ️ No notifications found in database\n";
    }

    return true;
}

// Run tests
echo "\n[1/3] Testing meeting today notifications\n";
testMeetingTodayNotifications();

echo "\n[2/3] Testing order of day notifications\n";
testOrderOfDayNotifications();

echo "\n[3/3] Checking notification database\n";
checkNotificationDatabase();

echo "\n✅ Tests completed\n";
