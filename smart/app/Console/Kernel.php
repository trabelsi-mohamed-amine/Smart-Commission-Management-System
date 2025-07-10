<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Schedule daily meeting notifications at 7:00 AM
        $schedule->command('app:notify-today-meetings')
                 ->dailyAt('07:00')
                 ->withoutOverlapping();

        // Monitor commission order-of-day changes hourly
        $schedule->command('app:notify-order-of-day-changed')
                 ->hourly()
                 ->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
