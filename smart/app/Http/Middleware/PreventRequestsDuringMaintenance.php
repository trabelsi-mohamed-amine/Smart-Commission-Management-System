<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PreventRequestsDuringMaintenance
{
    public function handle(Request $request, Closure $next)
    {
        // Logic pour empêcher les requêtes en période de maintenance
        return $next($request);
    }
}
