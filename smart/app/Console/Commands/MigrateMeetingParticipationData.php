<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use App\Models\Meeting;
use App\Models\User;

class MigrateMeetingParticipationData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:migrate-meeting-participation-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrates any existing participation data to the new simplified system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting migration of meeting participation data...');

        try {
            // Check if source table exists (either meeting_user or old meeting_participants)
            if (Schema::hasTable('meeting_user')) {
                $this->migrateFromMeetingUser();
            } else {
                $this->info('No migration source table found. Nothing to migrate.');
                return 0;
            }

            return 0;
        } catch (\Exception $e) {
            $this->error('Error during migration: ' . $e->getMessage());
            Log::error('Meeting participation data migration failed: ' . $e->getMessage());
            return 1;
        }
    }

    /**
     * Migrate data from meeting_user table
     */
    protected function migrateFromMeetingUser()
    {
        $this->info('Migrating from meeting_user table...');

        // Get all "joined" participants from the old table
        $oldParticipants = DB::table('meeting_user')
            ->where('status', 'joined')
            ->get();

        $this->info("Found {$oldParticipants->count()} joined participants to migrate.");

        // Get all users to retrieve their roles
        $users = User::all()->keyBy('id');

        // Migrate the data
        $migratedCount = 0;

        foreach ($oldParticipants as $participant) {
            // Get the user
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
            }
        }

        $this->info("Successfully migrated {$migratedCount} participants.");
    }
}
