<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\API\CommissionController;
use App\Http\Controllers\API\MeetingController;
use App\Http\Controllers\API\MeetingMinuteController;
use App\Http\Controllers\API\ModulesController;
use App\Http\Controllers\API\MeetingNotificationController;
use App\Http\Controllers\Api\TypologyController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\UserController;
use App\Models\Commission;
use App\Models\Meeting;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/contact', [ContactController::class, 'store']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Add named GET route for login to handle auth middleware redirects
Route::get('/login', function() {
    return response()->json(['error' => 'Please login first'], 401);
})->name('login');

// Role-based routes
// Administrator routes
Route::middleware(['auth', 'role:administrator'])->group(function () {
    // Commission management routes
    Route::resource('admin/commissions', CommissionController::class);

    // User management routes
    Route::resource('users', UserController::class);

    // Meeting minutes validation
    Route::get('/meeting-minutes/validate/{id}', [MeetingMinuteController::class, 'validate']);
});

// Commission manager routes
Route::middleware(['auth', 'role:commission_manager'])->group(function () {
    // Meeting planning routes
    Route::get('/meetings/plan', [MeetingController::class, 'showPlanningForm']);
    Route::post('/meetings/plan', [MeetingController::class, 'plan']);

    // Agenda management routes (disabled - controller doesn't exist)
    // Route::resource('agendas', AgendaController::class);

    // Meeting minutes management
    Route::resource('manager/meeting-minutes', MeetingMinuteController::class);
});

// Commission member routes
Route::middleware(['auth', 'role:commission_member'])->group(function () {
    // Commission consultation
    Route::get('/commissions/view', [CommissionController::class, 'index']);

    // Meeting minutes management
    Route::get('/meetings/minutes', [MeetingMinuteController::class, 'index']);

    // Meeting calendar routes
    Route::get('/meetings/calendar', [MeetingController::class, 'calendar']);

    // Meeting registration routes
    Route::post('/meetings/register/{id}', [MeetingController::class, 'register']);
});

// Existing routes
Route::resource('commissions', CommissionController::class);

//  Routes personnalisées pour les réunions liées aux commissions
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

// Stats routes
Route::get('/stats', function () {
    return response()->json([
        'commissions' => Commission::count(),
        'meetings' => Meeting::count(),
    ]);
});

// Meeting notification endpoint
Route::get('/api/meetings/today', [MeetingNotificationController::class, 'todayMeetings'])
    ->middleware('auth')
    ->name('meetings.today');

Route::get('/total-meetings', function () {
    return response()->json([
        'totalMeetings' => Meeting::count(),
    ]);
});

Route::get('/total-commissions', function () {
    return response()->json([
        'totalCommissions' => Commission::count(),
    ]);
});

Route::get('/pending-meetings', function () {
    return response()->json([
        'pendingMeetings' => Meeting::where('status', 'pending')->count(),
    ]);
});

Route::get('/ongoing-meetings', function () {
    return response()->json([
        'ongoingMeetings' => Meeting::where('status', 'ongoing')->count(),
    ]);
});

Route::get('/completed-meetings', function () {
    return response()->json([
        'completedMeetings' => Meeting::where('status', 'completed')->count(),
    ]);
});

Route::get('/active-commissions', function () {
    return response()->json([
        'activeCommissions' => Commission::where('status', 'active')->count(),
    ]);
});

Route::apiResource('modules', ModulesController::class);
Route::apiResource('typologies', TypologyController::class);
Route::apiResource('teams', TeamController::class);
Route::apiResource('services', ServiceController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('team-members', TeamMemberController::class);
