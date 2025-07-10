<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commission;
use App\Models\User;
use Illuminate\Http\Request;

class CommissionMemberController extends Controller
{
    /**
     * Get all members of a commission
     *
     * @param int $commissionId
     * @return \Illuminate\Http\Response
     */
    public function getCommissionMembers($commissionId)
    {
        // Check if user is authorized (admin or manager)
        if (auth()->check() &&
            (auth()->user()->role === 'administrator' ||
             auth()->user()->role === 'commission_manager')) {

            $commission = \App\Models\Commission::findOrFail($commissionId);

            // If user is a manager, they can only view their managed commissions
            if (auth()->user()->role === 'commission_manager' &&
                auth()->user()->id !== $commission->manager_id) {
                return response()->json([
                    'message' => 'Unauthorized. You can only view members of commissions you manage.'
                ], 403);
            }

            $members = $commission->members()->select('users.id', 'users.name', 'users.email')->get();

            return response()->json($members);
        }

        return response()->json([
            'message' => 'Unauthorized. Only administrators and commission managers can view commission members.'
        ], 403);
    }

    /**
     * Get all users eligible to be added as commission members
     *
     * @return \Illuminate\Http\Response
     */
    public function getEligibleMembers($commissionId)
    {
        // Check if user is authorized (admin or manager)
        if (auth()->check() &&
            (auth()->user()->role === 'administrator' ||
             auth()->user()->role === 'commission_manager')) {

            $commission = \App\Models\Commission::findOrFail($commissionId);

            // If user is a manager, they can only view their managed commissions
            if (auth()->user()->role === 'commission_manager' &&
                auth()->user()->id !== $commission->manager_id) {
                return response()->json([
                    'message' => 'Unauthorized. You can only manage members of commissions you manage.'
                ], 403);
            }

            // Get IDs of users already in the commission
            $existingMemberIds = $commission->members()->pluck('users.id')->toArray();

            // Get eligible users (role=commission_member) that are not already in the commission
            $eligibleUsers = \App\Models\User::where('role', 'commission_member')
                ->whereNotIn('id', $existingMemberIds)
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

            return response()->json($eligibleUsers);
        }

        return response()->json([
            'message' => 'Unauthorized. Only administrators and commission managers can view eligible commission members.'
        ], 403);
    }

    /**
     * Add a member to a commission
     *
     * @param \Illuminate\Http\Request $request
     * @param int $commissionId
     * @return \Illuminate\Http\Response
     */
    public function addMember(Request $request, $commissionId)
    {
        // Check if user is authorized (admin only)
        if (auth()->check() && auth()->user()->role === 'administrator') {
            $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);

            $commission = \App\Models\Commission::findOrFail($commissionId);
            $user = \App\Models\User::findOrFail($request->user_id);

            // Check if the user is a commission member
            if ($user->role !== 'commission_member') {
                return response()->json([
                    'message' => 'Only users with commission_member role can be added to commissions.'
                ], 400);
            }

            // Check if the member is already in the commission
            if ($commission->members()->where('users.id', $request->user_id)->exists()) {
                return response()->json([
                    'message' => 'This user is already a member of the commission.'
                ], 400);
            }

            // Add member to commission
            $commission->members()->attach($request->user_id);

            return response()->json([
                'message' => 'Member added to commission successfully.'
            ]);
        }

        return response()->json([
            'message' => 'Unauthorized. Only administrators can add members to commissions.'
        ], 403);
    }

    /**
     * Remove a member from a commission
     *
     * @param int $commissionId
     * @param int $userId
     * @return \Illuminate\Http\Response
     */
    public function removeMember($commissionId, $userId)
    {
        // Check if user is authorized (admin only)
        if (auth()->check() && auth()->user()->role === 'administrator') {
            $commission = \App\Models\Commission::findOrFail($commissionId);

            // Check if the member is in the commission
            if (!$commission->members()->where('users.id', $userId)->exists()) {
                return response()->json([
                    'message' => 'This user is not a member of the commission.'
                ], 400);
            }

            // Remove member from commission
            $commission->members()->detach($userId);

            return response()->json([
                'message' => 'Member removed from commission successfully.'
            ]);
        }

        return response()->json([
            'message' => 'Unauthorized. Only administrators can remove members from commissions.'
        ], 403);
    }

    /**
     * Get all commissions that the authenticated user is a member of or manages
     *
     * @return \Illuminate\Http\Response
     */
    public function getUserCommissions()
    {
        if (auth()->check()) {
            $user = auth()->user();

            try {
                // Log user info for debugging
                \Log::info('User accessing my-commissions', [
                    'user_id' => $user->id,
                    'user_role' => $user->role,
                    'user_email' => $user->email
                ]);

                // Return different results based on user role
                if ($user->role === 'commission_member') {
                    \Log::info('User is commission_member, retrieving member commissions');

                    // Using the same approach as in DashboardController for commission members
                    $commissions = \App\Models\Commission::whereHas('members', function($query) use ($user) {
                        $query->where('user_id', $user->id);
                    })
                    ->with('manager:id,name,email')
                    ->get(['id', 'name', 'description', 'order_of_day', 'manager_id']);

                    \Log::info('Retrieved member commissions', [
                        'count' => $commissions->count(),
                        'first_commission' => $commissions->first()
                    ]);

                    return response()->json($commissions);
                }
                else if ($user->role === 'commission_manager') {
                    \Log::info('User is commission_manager, retrieving managed commissions');

                    // For consistency, using the same approach as in DashboardController
                    $commissions = \App\Models\Commission::where('manager_id', $user->id)
                        ->with('manager:id,name,email')
                        ->get(['id', 'name', 'description', 'order_of_day', 'manager_id']);

                    \Log::info('Retrieved managed commissions', [
                        'count' => $commissions->count(),
                        'first_commission' => $commissions->first()
                    ]);

                    return response()->json($commissions);
                }
                else if ($user->role === 'administrator') {
                    // For administrators, return all commissions
                    $commissions = \App\Models\Commission::with('manager:id,name,email')
                        ->get(['id', 'name', 'description', 'order_of_day', 'manager_id']);
                    return response()->json($commissions);
                }

                \Log::warning('User has invalid role for my-commissions', ['role' => $user->role]);
                return response()->json([
                    'message' => 'This endpoint is only for commission members, managers, or administrators.'
                ], 403);

            } catch (\Exception $e) {
                \Log::error('Error in getUserCommissions', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json([
                    'message' => 'Erreur lors de la récupération de vos commissions: ' . $e->getMessage()
                ], 500);
            }
        }

        \Log::warning('Unauthenticated access to my-commissions');
        return response()->json([
            'message' => 'Unauthorized.'
        ], 401);
    }
}
