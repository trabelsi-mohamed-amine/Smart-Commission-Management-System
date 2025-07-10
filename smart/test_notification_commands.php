<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing Notifications Commands\n";
echo "=============================\n\n";

// Test meeting notifications
echo "[1/2] Testing meeting today notifications command\n";
echo "-----------------------------------------------\n";
Illuminate\Support\Facades\Artisan::call('app:notify-today-meetings');
echo Illuminate\Support\Facades\Artisan::output();

echo "\n\n";

// Test order of day notifications
echo "[2/2] Testing order of day notifications command\n";
echo "----------------------------------------------\n";
Illuminate\Support\Facades\Artisan::call('app:notify-order-of-day-changed');
echo Illuminate\Support\Facades\Artisan::output();

echo "\nDone.\n";
