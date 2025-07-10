<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequestsAndResponses
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log the request
        Log::info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'body' => $request->all(),
        ]);

        // Process the request
        $response = $next($request);

        // Log the response
        Log::info('API Response', [
            'status' => $response->getStatusCode(),
            'headers' => $response->headers->all(),
            'body' => $response instanceof \Illuminate\Http\JsonResponse ? $response->getData(true) : 'Non-JSON Response',
        ]);

        return $response;
    }
}
