<?php
// This test script demonstrates the non-scheduler notification methods

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use App\Models\Meeting;
use App\Models\Commission;

echo "====================================================\n";
echo "TESTING NON-SCHEDULER NOTIFICATION METHODS\n";
echo "====================================================\n";

// 1. Test the meeting notification middleware
echo "\n1. TESTING MIDDLEWARE-BASED NOTIFICATIONS\n";
echo "----------------------------------------\n";

// Clear previous cache entries to ensure middleware will run
$today = Carbon::today()->toDateString();
$users = User::limit(3)->get();

echo "Today's date: $today\n";

echo "Clearing notification cache for test users...\n";
foreach ($users as $user) {
    $cacheKey = "user_{$user->id}_meetings_checked_{$today}";
    Cache::forget($cacheKey);
    echo "- Cleared cache for user: {$user->name} (ID: {$user->id})\n";
}

// Create test meeting if no meetings exist today
$todayMeetingCount = Meeting::whereDate('date', $today)->count();
if ($todayMeetingCount == 0) {
    echo "\nNo meetings found for today. Creating a test meeting...\n";

    $commission = Commission::first();
    if (!$commission) {
        echo "Error: No commissions found in the database.\n";
        exit(1);
    }

    $meeting = new Meeting();
    $meeting->title = "Test Meeting - " . date('Y-m-d H:i:s');
    $meeting->description = "Test meeting created by test script";
    $meeting->date = $today;
    $meeting->time = "14:00:00";
    $meeting->commission_id = $commission->id;
    $meeting->status = "pending";
    $meeting->creator_id = $users[0]->id;
    $meeting->save();

    echo "- Created test meeting: {$meeting->title} (ID: {$meeting->id})\n";

    // Add participants
    foreach ($users as $user) {
        $meeting->participants()->create([
            'user_id' => $user->id,
            'status' => 'accepted',
            'role' => 'participant'
        ]);
        echo "- Added participant: {$user->name}\n";
    }
} else {
    echo "\nFound {$todayMeetingCount} meetings already scheduled for today\n";
}

// Test the middleware with a simulated request
echo "\nSimulating middleware execution for users...\n";

// Create a mock request
$request = new Illuminate\Http\Request();

// Create the middleware instance
$middleware = new App\Http\Middleware\CheckTodayMeetings();

// Create a mock closure that will just return "next"
$next = function ($request) {
    return "next";
};

foreach ($users as $user) {
    echo "\nTesting for user: {$user->name} (ID: {$user->id})\n";

    // Set the current user
    Auth::login($user);
      try {
        // Execute the middleware - we need to check notifications before and after
        $beforeCount = $user->notifications()
            ->whereDate('created_at', $today)
            ->where('type', 'App\\Notifications\\MeetingTodayNotification')
            ->count();

        // Execute middleware with a closure that returns a response
        $middleware->handle($request, function($request) {
            return response('OK');
        });
          echo "- Middleware executed successfully\n";

        // Check notifications
        $notificationCount = $user->notifications()
            ->whereDate('created_at', $today)
            ->where('type', 'App\\Notifications\\MeetingTodayNotification')
            ->count();

        // Check if new notifications were created
        $newNotifications = $notificationCount - $beforeCount;
        echo "- User has {$notificationCount} meeting notifications today (+" . $newNotifications . " new)\n";
    } catch (\Exception $e) {
        echo "- Middleware execution failed: " . $e->getMessage() . "\n";
    }
}

// 2. Test the API endpoint for today's meetings
echo "\n2. TESTING API ENDPOINT FOR TODAY'S MEETINGS\n";
echo "-------------------------------------------\n";

$controller = new App\Http\Controllers\API\MeetingNotificationController();

foreach ($users as $user) {
    echo "\nTesting API endpoint for user: {$user->name} (ID: {$user->id})\n";

    // Set the current user
    Auth::login($user);

    // Call the controller method
    $response = $controller->todayMeetings();

    // Extract the JSON data
    $responseData = $response->getData(true);
      // Output the results
    $meetingCount = is_array($responseData) ? count($responseData) : 0;
    echo "- Found {$meetingCount} meetings for today\n";

    if ($meetingCount > 0) {
        foreach ($responseData as $i => $meeting) {
            echo "  - Meeting #{$i}: {$meeting['title']} at {$meeting['time']}\n";
        }
    }
}

// Cleanup
Auth::logout();
echo "\nTests completed!\n";
echo "====================================================\n";
echo "Now you can implement the client-side notification checking\n";
echo "without relying on the scheduler. The middleware will notify\n";
echo "users when they log in, and the API endpoint allows the\n";
echo "frontend to check for meetings periodically.\n";
echo "====================================================\n";
