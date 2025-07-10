<?php

// Fichier : app/Http/Controllers/Api/CommissionController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\User;
use App\Notifications\NewCommissionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommissionController extends Controller
{
    public function index() {
        return Commission::with('manager:id,name,email')->get();
    }

    public function store(Request $request) {
        // Check if user is commission_member
        if (auth()->check() && auth()->user()->role === 'commission_member') {
            return response()->json([
                'message' => 'Unauthorized. Commission members cannot create commissions.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'order_of_day' => 'nullable|string',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        // Create the commission
        $commission = Commission::create($request->all());

        // Send notifications to administrators and commission managers
        $this->sendNewCommissionNotifications($commission);

        return response()->json($commission, 201);
    }

    public function show($id) {
        return response()->json(Commission::findOrFail($id));
    }

    public function update(Request $request, $id) {
        // Check if user is commission_member
        if (auth()->check() && auth()->user()->role === 'commission_member') {
            return response()->json([
                'message' => 'Unauthorized. Commission members cannot update commissions.'
            ], 403);
        }

        $commission = Commission::findOrFail($id);
        $commission->update($request->all());
        return response()->json($commission);
    }

    public function destroy($id) {
        // Check if user is commission_member
        if (auth()->check() && auth()->user()->role === 'commission_member') {
            return response()->json([
                'message' => 'Unauthorized. Commission members cannot delete commissions.'
            ], 403);
        }

        Commission::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function updateOrderOfDay(Request $request, $id) {
        // Check if user is commission_member
        if (auth()->check() && auth()->user()->role !== 'commission_manager' && auth()->user()->role !== 'administrator') {
            return response()->json([
                'message' => 'Unauthorized. Only commission managers and administrators can update the order of the day.'
            ], 403);
        }

        $request->validate([
            'order_of_day' => 'required|string',
        ]);

        $commission = Commission::findOrFail($id);
        $commission->order_of_day = $request->order_of_day;
        $commission->save();

        return response()->json([
            'message' => 'Order of the day updated successfully',
            'commission' => $commission
        ]);
    }

    /**
     * Send notifications to administrators and commission managers about a new commission
     *
     * @param Commission $commission The newly created commission
     * @return void
     */
    private function sendNewCommissionNotifications(Commission $commission)
    {
        try {
            // Get all administrators and commission managers
            $users = User::whereIn('role', ['administrator', 'commission_manager'])->get();

            // Also notify the specific manager if one is assigned
            if ($commission->manager_id) {
                $manager = User::find($commission->manager_id);
                if ($manager && !$users->contains('id', $manager->id)) {
                    $users->push($manager);
                }
            }

            // Notify each applicable user
            foreach ($users as $user) {
                $user->notify(new NewCommissionNotification($commission));
            }

            // Log the notifications
            Log::info("New commission notifications sent", [
                'commission_id' => $commission->id,
                'commission_name' => $commission->name,
                'notification_count' => $users->count()
            ]);
        } catch (\Exception $e) {
            Log::error("Error sending commission notifications: " . $e->getMessage());
        }
    }
}

