<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        // Log request info for debugging
        Log::info('Auth middleware', [
            'path' => $request->path(),
            'auth_check' => Auth::check(),
            'is_api' => $request->is('api/*'),
            'expects_json' => $request->expectsJson(),
            'bearer_token' => $request->bearerToken() ? 'present' : 'absent',
            'auth_header' => $request->header('Authorization') ? 'present' : 'absent'
        ]);

        if (!Auth::check()) {
            // API requests should receive a JSON response
            if ($request->is('api/*') || $request->expectsJson() || $request->wantsJson() || $request->header('X-Requested-With') == 'XMLHttpRequest') {
                return response()->json([
                    'message' => 'Unauthenticated',
                    'status' => 'error',
                    'code' => 401,
                    'path' => $request->path()
                ], 401);
            }

            // Web routes should redirect, but handle missing login route
            if (route_exists('login')) {
                return redirect()->route('login');
            } else {
                // Fallback if no login route exists
                return redirect('/');
            }
        }

        return $next($request);
    }
}

/**
 * Helper function to check if a named route exists
 */
function route_exists($name) {
    try {
        app('router')->getRoutes()->getByName($name);
        return true;
    } catch (\Exception $e) {
        return false;
    }
}
