<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Add these routes to api.php
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
        'token_received' => $request->bearerToken(),
        'auth_header' => $request->header('Authorization'),
        'timestamp' => now()->toDateTimeString(),
    ]);
});

// Test route for commission notifications
Route::get('/test-commission-notification', [\App\Http\Controllers\TestController::class, 'testCommissionNotification'])
    ->middleware('auth:sanctum');
