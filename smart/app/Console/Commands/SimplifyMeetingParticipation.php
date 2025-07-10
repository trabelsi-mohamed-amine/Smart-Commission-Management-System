<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class SimplifyMeetingParticipation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:simplify-meeting-participation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simplifies the meeting participation system with the new schema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting meeting participation system simplification...');

        try {
            // 1. Run the migration to create the new table structure
            $this->info('Creating simplified meeting participants table...');
            Artisan::call('migrate', ['--path' => 'database/migrations/2025_05_19_000000_simplify_meeting_participants_table.php']);
            $this->info('Migration complete.');

            // 2. Verify table structure
            if (!Schema::hasTable('meeting_participants')) {
                $this->error('The meeting_participants table was not created correctly. Aborting.');
                return 1;
            }

            $this->info('Checking table structure...');
            $columns = Schema::getColumnListing('meeting_participants');
            $expectedColumns = ['id', 'meeting_id', 'user_id', 'user_role', 'created_at', 'updated_at'];

            foreach ($expectedColumns as $column) {
                if (!in_array($column, $columns)) {
                    $this->error("Missing expected column: {$column}");
                    return 1;
                }
            }

            $this->info('Table structure verified.');

            // 3. Log completion
            $this->info('Meeting participation system simplification completed successfully.');
            Log::info('Meeting participation system was simplified successfully.');

            return 0;
        } catch (\Exception $e) {
            $this->error('Error simplifying meeting participation system: ' . $e->getMessage());
            Log::error('Meeting participation system simplification failed: ' . $e->getMessage());
            return 1;
        }
    }
}
