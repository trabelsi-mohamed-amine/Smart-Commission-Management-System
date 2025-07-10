<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MigrateMeetingParticipants extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-meeting-participants';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate meeting participation data from the old meeting_user table to the new meeting_participants table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of meeting participants data...');

        try {
            // First check if the old table exists
            if (!DB::getSchemaBuilder()->hasTable('meeting_user')) {
                $this->error('The meeting_user table does not exist. Nothing to migrate.');
                return 1;
            }

            // Check if the new table exists
            if (!DB::getSchemaBuilder()->hasTable('meeting_participants')) {
                $this->error('The meeting_participants table does not exist. Please run the migration first.');
                return 1;
            }

            // Get all "joined" participants from the old table
            $oldParticipants = DB::table('meeting_user')
                ->where('status', 'joined')
                ->get();

            $this->info("Found {$oldParticipants->count()} joined participants to migrate.");

            // Get all users to retrieve their roles
            $users = DB::table('users')->select('id', 'role')->get()->keyBy('id');

            // Migrate the data
            $migratedCount = 0;

            foreach ($oldParticipants as $participant) {
                // Get the user's role
                $user = $users->get($participant->user_id);
                if (!$user) {
                    $this->warn("User {$participant->user_id} not found. Skipping this participant.");
                    continue;
                }

                // Insert into new table
                try {
                    DB::table('meeting_participants')->insert([
                        'meeting_id' => $participant->meeting_id,
                        'user_id' => $participant->user_id,
                        'user_role' => $user->role,
                        'created_at' => $participant->created_at ?? now(),
                        'updated_at' => $participant->updated_at ?? now(),
                    ]);
                    $migratedCount++;
                } catch (\Exception $e) {
                    $this->warn("Failed to migrate participant: Meeting: {$participant->meeting_id}, User: {$participant->user_id}. Error: {$e->getMessage()}");
                    Log::error("Failed to migrate meeting participant: " . $e->getMessage(), [
                        'meeting_id' => $participant->meeting_id,
                        'user_id' => $participant->user_id
                    ]);
                }
            }

            $this->info("Successfully migrated {$migratedCount} participants.");
            $this->info("Migration complete!");

            return 0;
        } catch (\Exception $e) {
            $this->error("Failed to migrate meeting participants: {$e->getMessage()}");
            Log::error("Meeting participants migration failed: " . $e->getMessage());
            return 1;
        }
    }
}
