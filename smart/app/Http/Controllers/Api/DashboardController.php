<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meeting;
use App\Models\Commission;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    /**
     * Get simple stats for all users (authenticated or not)
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        // Very simple stats with minimal data
        return response()->json([
            'total_meetings' => Meeting::count(),
            'total_commissions' => Commission::count(),
            'timestamp' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Get simple stats for non-authenticated users (same as stats now)
     */
    public function statsTest()
    {
        // Keep this endpoint for backward compatibility but return the same data
        return $this->stats(request());
    }

    /**
     * Get next 5 upcoming meetings
     */
    public function getNextMeetings()
    {
        return response()->json(
            Meeting::where('date', '>=', now())
                  ->orderBy('date', 'asc')
                  ->limit(5)
                  ->get()
        );
    }
}
