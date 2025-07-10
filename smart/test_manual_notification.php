<?php

use Illuminate\Support\Facades\Notification;
use App\Models\User;
use App\Notifications\MeetingTodayNotification;
use App\Notifications\NewOrderOfDayNotification;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "SmartMeet Manual Notification Sender\n";
echo "==================================\n\n";

// Get the first user from the database
$user = User::first();

if (!$user) {
    echo "❌ No users found in the database. Cannot send notifications.\n";
    exit(1);
}

echo "👤 Selected user: {$user->name} (ID: {$user->id}, Email: {$user->email})\n\n";

// Find or create a meeting for today
$today = \Carbon\Carbon::today();
$meeting = \App\Models\Meeting::whereDate('date', $today)->first();

if (!$meeting) {
    $commission = \App\Models\Commission::first();
    if (!$commission) {
        echo "❌ No commissions found in the database. Cannot create a test meeting.\n";
        exit(1);
    }

    $meeting = new \App\Models\Meeting();
    $meeting->title = "Test Meeting for Manual Notification";
    $meeting->description = "This is a test meeting created for manual notifications";
    $meeting->commission_id = $commission->id;
    $meeting->date = $today;
    $meeting->time = '15:00:00';
    $meeting->participant_count = 1;
    $meeting->status = 'pending';
    $meeting->save();

    echo "📅 Created a new test meeting: {$meeting->title}\n";
} else {
    echo "📅 Using existing meeting: {$meeting->title}\n";
}

// Send a meeting today notification
echo "\n[1/2] Sending meeting today notification...\n";
$meetingNotification = new MeetingTodayNotification($meeting);
$user->notify($meetingNotification);
echo "✅ Meeting today notification sent to {$user->name}\n";

// Send an order of day notification
echo "\n[2/2] Sending order of day notification...\n";
$commission = \App\Models\Commission::first();
if ($commission) {
    // Get old order of day and generate new one
    $oldOrderOfDay = $commission->order_of_day ?? "No previous order of day";
    $newOrderOfDay = "Updated order of day - " . now()->format('Y-m-d H:i:s');

    // Update the order of day
    $commission->order_of_day = $newOrderOfDay;
    $commission->save();

    $orderNotification = new NewOrderOfDayNotification($commission, $oldOrderOfDay, $newOrderOfDay);
    $user->notify($orderNotification);
    echo "✅ Order of day notification sent to {$user->name}\n";
} else {
    echo "❌ No commissions found, cannot send order of day notification.\n";
}

// Check notification count
$notificationCount = $user->notifications()->count();
$unreadCount = $user->unreadNotifications()->count();
echo "\nTotal notifications for user: {$notificationCount} ({$unreadCount} unread)\n";

echo "\n✅ Manual notification test completed\n";
