<?php
namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Commission;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalMeetings = Meeting::count();
        $totalCommissions = Commission::count();

        // Get today's meetings for dashboard alert
        $todayMeetings = $this->getTodayMeetingsCount();

        return response()->json([
            'totalMeetings' => $totalMeetings,
            'totalCommissions' => $totalCommissions,
            'todayMeetings' => $todayMeetings,
        ]);
    }

    public function getMeetings()
    {
        $meetings = Meeting::orderBy('date', 'asc')->limit(3)->get(); // Reduced to 3 meetings for simplicity

        // Mark if meeting is today
        $today = date('Y-m-d');
        foreach ($meetings as $meeting) {
            $meeting->is_today = ($meeting->date === $today);
        }

        return response()->json($meetings);
    }

    /**
     * Get today's meetings count for the current user
     */
    private function getTodayMeetingsCount()
    {
        if (auth()->check()) {
            $user = auth()->user();
            $userId = $user->id;
            $today = date('Y-m-d');

            $query = Meeting::whereDate('date', $today)
                ->where('status', 'pending');

            // Filter by user participation or commission management
            $query->where(function($q) use ($userId) {
                $q->whereHas('participants', function($query) use ($userId) {
                    $query->where('user_id', $userId);
                });

                if (auth()->user()->role === 'commission_manager') {
                    $managedCommissionIds = auth()->user()->managedCommissions()->pluck('id')->toArray();

                    $q->orWhereIn('commission_id', $managedCommissionIds);
                }
            });

            return $query->count();
        }

        return 0;
    }
}

