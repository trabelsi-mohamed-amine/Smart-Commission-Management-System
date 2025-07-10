<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meeting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class MeetingNotificationController extends Controller
{
    /**
     * Get meetings scheduled for today for the authenticated user
     * This endpoint supports the client-side notification system
     */
    public function todayMeetings()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $today = Carbon::today()->toDateString();
            $userId = $user->id;

            // Base query for today's pending meetings
            $query = Meeting::with('commission')
                ->whereDate('date', $today)
                ->where('status', 'pending');

            // Filter by user participation or commission management
            $query->where(function($q) use ($userId) {
                // Include meetings where the user is a participant
                $q->whereHas('participants', function($query) use ($userId) {
                    $query->where('user_id', $userId);
                });

                // For commission managers, include meetings for their commissions
                if (Auth::user()->role === 'commission_manager') {
                    $managedCommissionIds = Auth::user()->managedCommissions()->pluck('id')->toArray();

                    $q->orWhereIn('commission_id', $managedCommissionIds);
                }
            });

            $meetings = $query->get();

            Log::info("Today's meetings fetched for user notification", [
                'user_id' => $userId,
                'meeting_count' => $meetings->count()
            ]);

            return response()->json($meetings);

        } catch (\Exception $e) {
            Log::error("Error fetching today's meetings: " . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch today\'s meetings'], 500);
        }
    }
}
