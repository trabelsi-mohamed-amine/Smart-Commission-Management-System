<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\API\CommissionController;
use App\Http\Controllers\API\MeetingController;
use App\Http\Controllers\API\MeetingMinuteController;
use App\Http\Controllers\API\MeetingTranscriptController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\UserController;



use App\Http\Controllers\API\ModulesController;
use App\Http\Controllers\Api\TypologyController;
use App\Http\Controllers\Api\TeamController;
// routes/api.php

// Include test routes (only in local environment)
if (app()->environment('local')) {
    require __DIR__ . '/test-routes.php';
}

// Define specific routes before resource routes to avoid conflicts
// This route must come BEFORE the apiResource to avoid being treated as a {meeting} parameter
Route::middleware('auth:sanctum')->get('meetings/available-participants', [\App\Http\Controllers\UserController::class, 'getEligibleParticipants']);

// Global routes with no auth
Route::apiResource('meetings', MeetingController::class);

// Meeting participation routes that require authentication
Route::middleware('auth:sanctum')->group(function() {
    Route::post('meetings/{meetingId}/join', [\App\Http\Controllers\Api\MeetingParticipantController::class, 'join']);
    Route::delete('meetings/{meetingId}/leave', [\App\Http\Controllers\Api\MeetingParticipantController::class, 'leave']);
    Route::get('meetings/{meetingId}/participants', [\App\Http\Controllers\Api\MeetingParticipantController::class, 'getParticipants']);
    Route::post('meetings/{meetingId}/participants', [\App\Http\Controllers\Api\MeetingParticipantController::class, 'addParticipant']);
    Route::delete('meetings/{meetingId}/participants/{userId}', [\App\Http\Controllers\Api\MeetingParticipantController::class, 'removeParticipant']);
});

// Route supplémentaire pour les commissions
Route::get('commissions', [\App\Http\Controllers\API\CommissionController::class, 'index']);


Route::resource('commissions', CommissionController::class);



// 🧩 Routes personnalisées pour les réunions liées aux commissions
Route::prefix('commissions/{commission}')->group(function () {
    Route::get('/meetings', [MeetingController::class, 'meetingsByCommission'])->name('commissions.meetings');
});

Route::apiResources([
    'services'         => ServiceController::class,
    'categories'       => CategoryController::class,
    'teammembers'      => TeamMemberController::class,
    'commissions'      => CommissionController::class,
    'meetings'         => MeetingController::class,
    'meetingminutes'   => MeetingMinuteController::class,
]);


use App\Models\Commission;
use App\Models\Meeting;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Debug routes
Route::get('/debug-log', [\App\Http\Controllers\DebugController::class, 'testLog']);
Route::get('/diagnostics', [\App\Http\Controllers\DebugController::class, 'systemDiagnostics']);

// Allow anyone to read commissions (index and show)
Route::get('commissions', [CommissionController::class, 'index']);
Route::get('commissions/{commission}', [CommissionController::class, 'show']);

// Restrict write operations to non-commission_member users
Route::middleware(['auth:sanctum'])->group(function () {
    // The controller will check if user is commission_member
    Route::post('commissions', [CommissionController::class, 'store']);
    Route::put('commissions/{commission}', [CommissionController::class, 'update']);
    Route::patch('commissions/{commission}', [CommissionController::class, 'update']);
    Route::delete('commissions/{commission}', [CommissionController::class, 'destroy']);
});
Route::apiResource('meetings', MeetingController::class);





// routes/api.php
// routes/api.php



Route::apiResource('modules', ModulesController::class);
Route::apiResource('typologies', TypologyController::class);
Route::apiResource('teams', TeamController::class);



// Routes API pour les réunions (Meetings)


Route::apiResource('meeting-minutes', MeetingMinuteController::class);
Route::get('/meeting-minutes', [MeetingMinuteController::class, 'index']);
Route::post('/meeting-minutes', [MeetingMinuteController::class, 'store']);
Route::post('/meeting-minutes/{id}', [MeetingMinuteController::class, 'update']); // _method=PUT
Route::delete('/meeting-minutes/{id}', [MeetingMinuteController::class, 'destroy']);
Route::put('/meeting-minutes/{id}/validate', [MeetingMinuteController::class, 'validate']);
Route::get('/meeting-minutes/by-meeting/{id}', [MeetingMinuteController::class, 'getByMeeting']);

// Assurez-vous aussi d’avoir cette route pour les réunions




Route::middleware('auth:sanctum')->group(function () {
    // Créer une minute de réunion
    Route::post('/meeting-minutes', [MeetingMinuteController::class, 'store']);
    // Modifier une minute de réunion
    Route::put('/meeting-minutes/{id}', [MeetingMinuteController::class, 'update']);
    // Supprimer une minute de réunion
    Route::delete('/meeting-minutes/{id}', [MeetingMinuteController::class, 'destroy']);
});




Route::prefix('teams')->group(function () {
    // Récupère toutes les équipes
    Route::get('/', [TeamController::class, 'index']);

    // Récupère une équipe spécifique
    Route::get('{id}', [TeamController::class, 'show']);

    // Crée une nouvelle équipe
    Route::post('/', [TeamController::class, 'store']);

    // Met à jour une équipe existante
    Route::put('{id}', [TeamController::class, 'update']);

    // Supprime une équipe
    Route::delete('{id}', [TeamController::class, 'destroy']);
});



Route::apiResource('services', ServiceController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('team-members', TeamMemberController::class);

// Stats endpoints via DashboardController
Route::middleware('auth:sanctum')->get('/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);

// Non-authenticated stats endpoint - provides limited data without role-specific information
Route::get('/stats-test', [\App\Http\Controllers\Api\DashboardController::class, 'statsTest']);

// Authentication testing endpoints
Route::get('/auth-test', function (Request $request) {
    $user = $request->user();
    return response()->json([
        'authenticated' => !is_null($user),
        'user' => $user ? [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ] : null,
        'token' => $request->bearerToken(),
        'headers' => $request->header('Authorization'),
        'timestamp' => now()->toDateTimeString(),
    ]);
})->middleware('auth:sanctum');

Route::get('/token-test', function (Request $request) {
    return response()->json([
        'token_received' => $request->bearerToken() ? true : false,
        'auth_header' => $request->header('Authorization') ? true : false, // Don't return the actual token for security
        'timestamp' => now()->toDateTimeString(),
    ]);
});

// Next meetings API - returns upcoming meetings relevant to the current user
Route::middleware('auth:sanctum')->get('/next-meetings', [\App\Http\Controllers\Api\DashboardController::class, 'nextMeetings']);



// Commissions actives
Route::get('/active-commissions', function () {
    return response()->json([
        'activeCommissions' => Commission::where('status', 'active')->count(),
    ]);
});


// Admin user management routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Apply the role middleware explicitly
    Route::middleware('role:administrator')->group(function () {
        // User management routes
        Route::apiResource('users', UserController::class);
        Route::get('/dashboard', [UserController::class, 'adminDashboard']);
        Route::post('/users/by-role', [UserController::class, 'getUsersByRole']);
        Route::post('/users/batch', [UserController::class, 'batchOperations']);
        Route::get('/users/search', [UserController::class, 'search']);
    });

    // Test route without role middleware for debugging
    Route::get('/test', function() {
        return response()->json(['message' => 'API is working', 'auth' => auth()->check(), 'user' => auth()->user()]);
    });
});


// Contact routes
Route::post('/contacts', [ContactController::class, 'store']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show']);
    Route::put('/contacts/{contact}/mark-as-read', [ContactController::class, 'markAsRead']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);
});


// Authentication test route
Route::middleware('auth:sanctum')->group(function () {
    // Test route to check if authentication is working
    Route::get('/test-auth', function () {
        return response()->json([
            'message' => 'Authentication is working',
            'user' => auth()->user()
        ]);
    });
});

// Routes API pour les transcriptions de réunions
// Public / Read-only routes for meeting transcripts
Route::get('/meeting-transcripts', [MeetingTranscriptController::class, 'index']);
Route::get('/meeting-transcripts/by-meeting/{id}', [MeetingTranscriptController::class, 'getByMeeting']);
Route::get('/meeting-transcripts/{id}', [MeetingTranscriptController::class, 'show']);

// Protected routes - require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Routes for both commission members and managers
    Route::post('/meeting-transcripts', [MeetingTranscriptController::class, 'store']);
    Route::put('/meeting-transcripts/{id}', [MeetingTranscriptController::class, 'update']);
    Route::delete('/meeting-transcripts/{id}', [MeetingTranscriptController::class, 'destroy']);

    // Commission manager routes - validate transcripts
    Route::put('/meeting-transcripts/{id}/validate', [MeetingTranscriptController::class, 'validate']);

    // Route for commission members to resubmit rejected transcripts
    Route::put('/meeting-transcripts/{id}/resubmit', [MeetingTranscriptController::class, 'resubmit']);
});

// Direct user management routes - temporary workaround
Route::middleware(['auth:sanctum'])->group(function () {
    // Basic user routes without role middleware for testing
    Route::get('/users-direct', [UserController::class, 'index']);
    Route::get('/users-direct/{user}', [UserController::class, 'show']);
    Route::post('/users-direct', [UserController::class, 'store']);
    Route::put('/users-direct/{user}', [UserController::class, 'update']);
    Route::delete('/users-direct/{user}', [UserController::class, 'destroy']);
});

// Route for updating the order of the day
Route::middleware('auth:sanctum')->put('commissions/{commission}/order-of-day', [CommissionController::class, 'updateOrderOfDay']);

// Route for getting commission managers
Route::middleware('auth:sanctum')->get('managers/commission', [\App\Http\Controllers\Api\ManagerController::class, 'getCommissionManagers']);

// Route for getting user's commissions with order of the day
Route::middleware('auth:sanctum')->get('dashboard/user-commissions', [\App\Http\Controllers\API\DashboardController::class, 'userCommissions']);

// Notification routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/mark-as-read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::get('/notifications/unread-count', [\App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
    Route::delete('/notifications/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'destroy']);
});

// Commission Member routes
Route::middleware('auth:sanctum')->prefix('commissions')->group(function () {
    // Routes for administrators and commission managers
    Route::get('{commission}/members', [\App\Http\Controllers\Api\CommissionMemberController::class, 'getCommissionMembers']);
    Route::get('{commission}/eligible-members', [\App\Http\Controllers\Api\CommissionMemberController::class, 'getEligibleMembers']);

    // Routes for administrators only
    Route::post('{commission}/members', [\App\Http\Controllers\Api\CommissionMemberController::class, 'addMember']);
    Route::delete('{commission}/members/{user}', [\App\Http\Controllers\Api\CommissionMemberController::class, 'removeMember']);
});

// Route for commission members to get their commissions
Route::middleware('auth:sanctum')->get('user/my-commissions', [\App\Http\Controllers\Api\CommissionMemberController::class, 'getUserCommissions']);

// Notification routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/mark-as-read', [\App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::get('/notifications/unread-count', [\App\Http\Controllers\Api\NotificationController::class, 'unreadCount']);
});
