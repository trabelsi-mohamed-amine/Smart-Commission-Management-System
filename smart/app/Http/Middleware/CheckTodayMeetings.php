<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\User;
use App\Notifications\MeetingTodayNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckTodayMeetings
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            $userId = $user->id;

            // Use a cache key specific to this user and today's date
            // This ensures we only check once per day per user
            $today = Carbon::today()->toDateString();
            $cacheKey = "user_{$userId}_meetings_checked_{$today}";

            if (!Cache::has($cacheKey)) {
                // Get meetings for today where the user is a participant
                $todayMeetings = Meeting::whereDate('date', $today)
                    ->where('status', 'pending')
                    ->whereHas('participants', function($query) use ($userId) {
                        $query->where('user_id', $userId);
                    })
                    ->get();

                // If user is a commission manager, also get meetings for their commissions
                if ($user->role === 'commission_manager') {
                    $managedCommissionIds = $user->managedCommissions()->pluck('id')->toArray();

                    $managerMeetings = Meeting::whereDate('date', $today)
                        ->where('status', 'pending')
                        ->whereIn('commission_id', $managedCommissionIds)
                        ->get();

                    // Merge the collections (avoiding duplicates)
                    $todayMeetings = $todayMeetings->merge($managerMeetings)->unique('id');
                }

                // Send notifications for each meeting
                foreach ($todayMeetings as $meeting) {
                    $user->notify(new MeetingTodayNotification($meeting));
                    Log::info("Login-triggered meeting notification sent", [
                        'user_id' => $userId,
                        'meeting_id' => $meeting->id,
                        'meeting_title' => $meeting->title
                    ]);
                }

                // Cache the result to avoid duplicate notifications
                // Store for 20 hours - long enough to cover a day but reset for the next day
                Cache::put($cacheKey, true, 60 * 60 * 20);
            }
        }

        return $next($request);
    }
}
