<?php

return [   'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8000'], // Allow common development ports
    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],
    'allowed_origins_patterns' => [],
     'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
