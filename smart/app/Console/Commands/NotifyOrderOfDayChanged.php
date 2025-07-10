<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Commission;
use App\Models\User;
use App\Notifications\NewOrderOfDayNotification;

class NotifyOrderOfDayChanged extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-order-of-day-changed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for changes to commission order of day and send notifications';

    // Store cache in a file instead of database
    protected $cacheFile;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Set up cache file path
        $this->cacheFile = storage_path('app/order_of_day_cache.json');

        // Initialize cache file if it doesn't exist
        if (!file_exists($this->cacheFile)) {
            file_put_contents($this->cacheFile, json_encode([]));
        }
        // Get all commissions that have an order of day
        $commissions = Commission::whereNotNull('order_of_day')
                      ->get();

        $this->info("Checking " . $commissions->count() . " commissions for order of day changes");

        foreach ($commissions as $commission) {
            // Check if we have a previous value for this commission's order of day
            $cacheKey = "commission_{$commission->id}_order_of_day";

            // Get the previously cached value
            $previousOrderOfDay = $this->getFromCache($commission->id);

            // If there was no previous value, just cache the current value and skip
            if ($previousOrderOfDay === null) {
                $this->saveToCache($commission->id, $commission->order_of_day);
                continue;
            }

            // Compare current order of day with the previous one
            if ($commission->order_of_day !== $previousOrderOfDay) {
                $this->info("Detected change in order of day for commission: {$commission->name}");

                // Get all members of the commission to notify them
                $members = $commission->members;

                // Also notify the manager
                $manager = $commission->manager;

                $notifiedCount = 0;

                // Notify commission members
                foreach ($members as $member) {
                    $member->notify(new NewOrderOfDayNotification(
                        $commission,
                        $previousOrderOfDay,
                        $commission->order_of_day
                    ));
                    $notifiedCount++;
                }

                // Notify manager if exists
                if ($manager) {
                    $manager->notify(new NewOrderOfDayNotification(
                        $commission,
                        $previousOrderOfDay,
                        $commission->order_of_day
                    ));
                    $notifiedCount++;
                }

                $this->info("Sent {$notifiedCount} notifications for updated order of day");
                Log::info("Order of day change notifications sent", [
                    'commission_id' => $commission->id,
                    'commission_name' => $commission->name,
                    'notification_count' => $notifiedCount
                ]);

                // Update the cached value to the new one
                $this->saveToCache($commission->id, $commission->order_of_day);
            }
        }

        $this->info("Order of day check completed");
    }

    /**
     * Get cached order of day from the cache file
     */
    protected function getFromCache($commissionId)
    {
        $cache = json_decode(file_get_contents($this->cacheFile), true);
        $key = 'commission_order_of_day_' . $commissionId;

        return $cache[$key] ?? null;
    }

    /**
     * Save order of day to the cache file
     */
    protected function saveToCache($commissionId, $orderOfDay)
    {
        $cache = json_decode(file_get_contents($this->cacheFile), true);
        $key = 'commission_order_of_day_' . $commissionId;

        $cache[$key] = $orderOfDay;

        file_put_contents($this->cacheFile, json_encode($cache));
    }
}
