<?php
namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * @param string|string[] $roles A single role or array of roles allowed to access the route
     */
    public function handle(Request $request, Closure $next, $roles): Response
    {
        if (!$request->user()) {
            abort(401, 'Unauthenticated.');
        }

        // Convert single role string to array for uniform handling
        $roleArray = is_array($roles) ? $roles : explode('|', $roles);

        if (!in_array($request->user()->role, $roleArray)) {
            abort(403, 'Unauthorized action. You do not have the required permissions.');
        }

        return $next($request);
    }
}
