<?php 
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TrustProxies
{
    public function handle(Request $request, Closure $next)
    {
        // Logic du middleware ici (généralement pas de logique pour ce middleware)
        return $next($request);
    }
}
