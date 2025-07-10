<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\TokenMismatchException;

class VerifyCsrfToken
{
    public function handle(Request $request, Closure $next)
    {
        // Vérification CSRF
        return $next($request);
    }
}
