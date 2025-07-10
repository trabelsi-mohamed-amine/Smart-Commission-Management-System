<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogErrors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            return $next($request);
        } catch (\Exception $e) {
            Log::error('Caught exception in LogErrors middleware', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_url' => $request->fullUrl(),
                'request_method' => $request->method(),
                'request_data' => $request->all(),
            ]);

            // Return a JSON response for API routes
            if (strpos($request->path(), 'api/') === 0) {
                return response()->json([
                    'message' => 'An error occurred while processing your request.',
                    'error' => $e->getMessage()
                ], 500);
            }

            // Re-throw the exception for web routes to show error page
            throw $e;
        }
    }
}
