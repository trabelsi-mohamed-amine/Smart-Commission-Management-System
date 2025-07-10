<?php
// test_commission_notification.php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Carbon\Carbon;
use App\Models\User;
use App\Models\Commission;
use App\Notifications\NewCommissionNotification;
use Illuminate\Support\Facades\Log;

echo "========================================================\n";
echo "TESTING COMMISSION NOTIFICATION FEATURE\n";
echo "========================================================\n";

// Get current date
$today = Carbon::today()->toDateString();
echo "Today's date: $today\n\n";

// Get users who should receive notifications
echo "Finding users who should receive notifications (administrators and commission managers)...\n";
$users = User::whereIn('role', ['administrator', 'commission_manager'])->get();

echo "Found " . $users->count() . " users who should receive commission notifications:\n";
foreach ($users as $user) {
    echo "- {$user->name} (ID: {$user->id}, Role: {$user->role})\n";
}

// Create a test commission
echo "\nCreating a test commission...\n";
$testCommission = new Commission();
$testCommission->name = "Test Commission - " . date('Y-m-d H:i:s');
$testCommission->description = "Test commission created by test script";
$testCommission->manager_id = $users->where('role', 'commission_manager')->first()->id ?? null;
$testCommission->save();

echo "- Created test commission: {$testCommission->name} (ID: {$testCommission->id})\n";
if ($testCommission->manager_id) {
    $manager = User::find($testCommission->manager_id);
    echo "- Assigned manager: {$manager->name} (ID: {$manager->id})\n";
}

// Send notifications manually
echo "\nSending notifications...\n";
$notificationCount = 0;
foreach ($users as $user) {
    try {
        $user->notify(new NewCommissionNotification($testCommission));
        $notificationCount++;
        echo "- Notification sent to {$user->name} (ID: {$user->id})\n";
    } catch (\Exception $e) {
        echo "- Error sending notification to user ID {$user->id}: {$e->getMessage()}\n";
    }
}

echo "\nSent $notificationCount notifications\n";

// Check notifications in the database
echo "\nChecking notifications in the database...\n";
$notificationsToday = DB::table('notifications')
    ->whereDate('created_at', $today)
    ->where('type', 'App\\Notifications\\NewCommissionNotification')
    ->get();

echo "Found " . $notificationsToday->count() . " commission notifications created today\n";

if ($notificationsToday->count() > 0) {
    echo "Notification sample: \n";
    print_r(json_decode($notificationsToday[0]->data));
}

echo "\nTest completed!\n";
echo "========================================================\n";
echo "You should now see notifications about the new commission\n";
echo "when you log in to the application.\n";
echo "========================================================\n";
