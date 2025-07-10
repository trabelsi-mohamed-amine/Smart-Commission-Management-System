<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Constructor for UserController.
     * Note: Middleware is applied in routes/api.php instead of here to prevent conflicts.
     */
    public function __construct()
    {
        // Middleware is applied in routes/api.php
    }

    /**
     * Admin dashboard with user statistics and management options.
     */
    public function adminDashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'administrators' => User::where('role', 'administrator')->count(),
            'commission_managers' => User::where('role', 'commission_manager')->count(),
            'commission_members' => User::where('role', 'commission_member')->count(),
            'recent_users' => User::latest()->take(5)->get()
        ];

        return response()->json([
            'message' => 'Admin dashboard data',
            'stats' => $stats
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json(['data' => $users]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:administrator,commission_manager,commission_member',
        ]);

        // Verify the current user is an administrator
        if(!auth()->user()->isAdministrator()) {
            return response()->json(['message' => 'Unauthorized. Only administrators can create users.'], 403);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Log the user creation action
        \Log::info('User created by admin', [
            'created_by' => auth()->id(),
            'new_user_id' => $user->id,
            'new_user_role' => $user->role
        ]);

        return response()->json(['data' => $user, 'message' => 'User created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json(['data' => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|string|in:administrator,commission_manager,commission_member',
        ]);

        // Verify the current user is an administrator
        if(!auth()->user()->isAdministrator()) {
            return response()->json(['message' => 'Unauthorized. Only administrators can update users.'], 403);
        }

        // Prevent changing the role of the last administrator
        if ($user->isAdministrator() && $request->role !== 'administrator') {
            $adminCount = User::where('role', 'administrator')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot change role of the last administrator'
                ], 403);
            }
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        // Only update password if provided
        if ($request->filled('password')) {
            $request->validate([
                'password' => 'string|min:8',
            ]);
            $data['password'] = Hash::make($request->password);
        }

        // Store old role for logging
        $oldRole = $user->role;

        $user->update($data);

        // Log the update action
        \Log::info('User updated by admin', [
            'updated_by' => auth()->id(),
            'updated_user_id' => $user->id,
            'old_role' => $oldRole,
            'new_role' => $user->role
        ]);

        return response()->json(['data' => $user, 'message' => 'User updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Verify the current user is an administrator
        if(!auth()->user()->isAdministrator()) {
            return response()->json(['message' => 'Unauthorized. Only administrators can delete users.'], 403);
        }

        // Prevent self-deletion
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        // Prevent deleting the last administrator
        if ($user->isAdministrator()) {
            $adminCount = User::where('role', 'administrator')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Cannot delete the last administrator account'
                ], 403);
            }
        }

        // Store user info for logging
        $userInfo = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role
        ];

        $user->delete();

        // Log the deletion
        \Log::info('User deleted by admin', [
            'deleted_by' => auth()->id(),
            'deleted_user' => $userInfo
        ]);

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Get users by role.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsersByRole(Request $request)
    {
        $request->validate([
            'role' => 'required|string|in:administrator,commission_manager,commission_member',
        ]);

        $users = User::where('role', $request->role)->get();

        return response()->json([
            'data' => $users,
            'count' => $users->count(),
            'role' => $request->role
        ]);
    }

    /**
     * Perform batch operations on users.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function batchOperations(Request $request)
    {
        $request->validate([
            'operation' => 'required|string|in:delete,change_role',
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
            'new_role' => 'required_if:operation,change_role|string|in:administrator,commission_manager,commission_member',
        ]);

        // Verify the current user is an administrator
        if(!auth()->user()->isAdministrator()) {
            return response()->json(['message' => 'Unauthorized. Only administrators can perform batch operations.'], 403);
        }

        // Prevent operations on the current user
        if (in_array(auth()->id(), $request->user_ids)) {
            return response()->json(['message' => 'Cannot perform operations on your own account'], 403);
        }

        $results = [
            'success' => [],
            'failed' => [],
        ];

        $adminCount = User::where('role', 'administrator')->count();
        $targetUsers = User::whereIn('id', $request->user_ids)->get();

        foreach ($targetUsers as $user) {
            try {
                if ($request->operation === 'delete') {
                    // Prevent deleting the last administrator
                    if ($user->isAdministrator() && $adminCount <= 1) {
                        $results['failed'][] = [
                            'id' => $user->id,
                            'reason' => 'Cannot delete the last administrator'
                        ];
                        continue;
                    }
                    $user->delete();
                    $results['success'][] = [
                        'id' => $user->id,
                        'operation' => 'delete'
                    ];
                } else if ($request->operation === 'change_role') {
                    // Prevent changing role of the last administrator
                    if ($user->isAdministrator() && $request->new_role !== 'administrator' && $adminCount <= 1) {
                        $results['failed'][] = [
                            'id' => $user->id,
                            'reason' => 'Cannot change role of the last administrator'
                        ];
                        continue;
                    }

                    // Store old role for logging
                    $oldRole = $user->role;

                    $user->update(['role' => $request->new_role]);

                    $results['success'][] = [
                        'id' => $user->id,
                        'operation' => 'change_role',
                        'old_role' => $oldRole,
                        'new_role' => $request->new_role
                    ];
                }
            } catch (\Exception $e) {
                $results['failed'][] = [
                    'id' => $user->id,
                    'reason' => $e->getMessage()
                ];
            }
        }

        // Log the batch operation
        \Log::info('Batch user operation by admin', [
            'performed_by' => auth()->id(),
            'operation' => $request->operation,
            'results' => $results
        ]);

        return response()->json([
            'message' => 'Batch operation completed',
            'results' => $results
        ]);
    }

    /**
     * Search for users by name or email.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'role' => 'nullable|string|in:administrator,commission_manager,commission_member',
        ]);

        $query = $request->query('query');
        $role = $request->query('role');

        $usersQuery = User::where(function($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%");
        });

        // Filter by role if provided
        if ($role) {
            $usersQuery->where('role', $role);
        }

        $users = $usersQuery->get();

        return response()->json([
            'data' => $users,
            'count' => $users->count(),
            'query' => $query
        ]);
    }

    /**
     * Get users who are eligible to be added as meeting participants
     * Including administrators, commission managers and commission members
     */
    public function getEligibleParticipants()
    {
        $user = auth()->user();

        \Log::info('getEligibleParticipants called', [
            'user' => $user ? ['id' => $user->id, 'role' => $user->role] : 'unauthenticated',
        ]);

        // Only admins and commission managers can view this list
        if (!$user || !in_array($user->role, ['administrator', 'commission_manager'])) {
            \Log::warning('Unauthorized access to getEligibleParticipants', [
                'user' => $user ? ['id' => $user->id, 'role' => $user->role] : 'unauthenticated'
            ]);
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $users = User::select('id', 'name', 'email', 'role')
            ->whereIn('role', ['administrator', 'commission_manager', 'commission_member'])
            ->orderBy('role')
            ->orderBy('name')
            ->get();

        \Log::info('Returning eligible participants', ['count' => count($users)]);

        return response()->json($users);
    }
}
