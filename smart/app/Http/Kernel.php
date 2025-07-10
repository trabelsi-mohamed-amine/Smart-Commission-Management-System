<?php

namespace App\Http;

use App\Http\Middleware\CheckRole;
use Illuminate\Foundation\Http\Kernel as HttpKernel;


class Kernel extends HttpKernel
{
    /**
     * Liste des middleware de l'application.
     *
     * @var array
     */
    protected $middleware = [
        \App\Http\Middleware\LogErrors::class, // Add this first to catch all exceptions
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class, // Assure-toi qu'il figure ici une seule fois
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\LoadConfiguration::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        \App\Http\Middleware\LogRequestsAndResponses::class,

        // Retire la ligne en doublon :
        // \Illuminate\Http\Middleware\HandleCors::class,
    ];


    /**
     * Liste des middleware groupes de l'application.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \App\Http\Middleware\CheckTodayMeetings::class,
        ],

       'api' => [
         \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
         'throttle:api',
         \Illuminate\Routing\Middleware\SubstituteBindings::class,
         \App\Http\Middleware\LogRequestsAndResponses::class,
         \App\Http\Middleware\CheckTodayMeetings::class,
      ],

    ];

    /**
     * The application's middleware aliases.
     *
     * @var array<string, class-string|string>
     */
    protected $middlewareAliases = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'role' => \App\Http\Middleware\CheckRole::class,
        'cors' => \Illuminate\Http\Middleware\HandleCors::class,
    ];
}
