<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EncryptCookies
{
    public function handle(Request $request, Closure $next)
    {
        // Logic pour l'encryptage des cookies
        return $next($request);
    }
}
