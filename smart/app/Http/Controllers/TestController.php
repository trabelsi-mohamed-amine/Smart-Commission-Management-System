<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commission;
use App\Models\User;
use App\Notifications\NewCommissionNotification;

class TestController extends Controller
{
    /**
     * Test the Commission notification feature
     */
    public function testCommissionNotification()
    {
        // Only allow in local environment
        if (app()->environment() !== 'local') {
            return response()->json(['error' => 'This endpoint is only available in local environment'], 403);
        }

        $output = [];
        $output[] = "TESTING COMMISSION NOTIFICATION FEATURE";
        $output[] = "----------------------------------";

        // Get users who should receive notifications
        $output[] = "Finding users who should receive notifications...";
        $users = User::whereIn('role', ['administrator', 'commission_manager'])->get();

        $output[] = "Found " . $users->count() . " users who should receive commission notifications:";
        foreach ($users as $user) {
            $output[] = "- {$user->name} (ID: {$user->id}, Role: {$user->role})";
        }

        // Create a test commission
        $output[] = "Creating a test commission...";
        $testCommission = new Commission();
        $testCommission->name = "Test Commission - " . date('Y-m-d H:i:s');
        $testCommission->description = "Test commission created by test script";
        $testCommission->manager_id = $users->where('role', 'commission_manager')->first()->id ?? null;
        $testCommission->save();

        $output[] = "- Created test commission: {$testCommission->name} (ID: {$testCommission->id})";

        if ($testCommission->manager_id) {
            $manager = User::find($testCommission->manager_id);
            $output[] = "- Assigned manager: {$manager->name} (ID: {$manager->id})";
        }

        // Send notifications manually
        $output[] = "Sending notifications...";
        $notificationCount = 0;
        foreach ($users as $user) {
            try {
                $user->notify(new NewCommissionNotification($testCommission));
                $notificationCount++;
                $output[] = "- Notification sent to {$user->name} (ID: {$user->id})";
            } catch (\Exception $e) {
                $output[] = "- Error sending notification to user ID {$user->id}: {$e->getMessage()}";
            }
        }

        $output[] = "Sent $notificationCount notifications";

        // Check notifications in the database
        $output[] = "Checking notifications in the database...";
        $notificationsCount = \DB::table('notifications')
            ->where('type', 'App\\Notifications\\NewCommissionNotification')
            ->where('data', 'like', "%{$testCommission->id}%")
            ->count();

        $output[] = "Found $notificationsCount notifications for this commission";

        $output[] = "Test completed!";
        $output[] = "You should now see notifications about the new commission when you log in to the application.";

        return response()->json(['output' => $output, 'commission' => $testCommission]);
    }
}
