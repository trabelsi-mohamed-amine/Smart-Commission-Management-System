<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoadConfiguration
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Charge les configurations de l'application
            // Add your configuration loading logic here if needed

            return $next($request);
        } catch (\Exception $e) {
            Log::error('Error in LoadConfiguration middleware: ' . $e->getMessage());
            throw $e;
        }
    }
}
