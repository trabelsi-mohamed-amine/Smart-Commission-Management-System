<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MeetingSeeder extends Seeder
{
    public function run(): void
    {
        $commissions = DB::table('commissions')->get();

        foreach ($commissions as $commission) {
            // Create 3 meetings for each commission
            for ($i = 0; $i < 3; $i++) {
                $date = Carbon::now()->addDays(rand(-10, 30))->format('Y-m-d');
                $time = sprintf("%02d:%02d:00", rand(9, 17), rand(0, 59));

                $meetingId = DB::table('meetings')->insertGetId([
                    'title' => "Réunion " . ($i + 1) . " - " . $commission->name,
                    'description' => "Ordre du jour de la réunion " . ($i + 1) . " pour " . $commission->name,
                    'commission_id' => $commission->id,
                    'date' => $date,
                    'time' => $time,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Get all potential participants (admins, managers, members)
                $participants = collect();

                // Add commission manager as participant
                $manager = DB::table('commissions')
                    ->join('users', 'commissions.manager_id', '=', 'users.id')
                    ->where('commissions.id', $commission->id)
                    ->select('users.id')
                    ->first();

                if ($manager) {
                    $participants->push($manager->id);
                }

                // Add administrator users (1-2 random admins)
                $administrators = DB::table('users')
                    ->where('role', 'administrator')
                    ->inRandomOrder()
                    ->limit(rand(1, 2))
                    ->pluck('id');

                $participants = $participants->concat($administrators);

                // Add commission members (2-4 random members)
                $members = DB::table('users')
                    ->where('role', 'commission_member')
                    ->inRandomOrder()
                    ->limit(rand(2, 4))
                    ->pluck('id');

                $participants = $participants->concat($members);

                // Add all participants to the meeting
                $participantCount = 0;
                foreach ($participants as $userId) {
                    DB::table('meeting_participants')->insert([
                        'meeting_id' => $meetingId,
                        'user_id' => $userId,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    $participantCount++;
                }

                // Update participant count
                DB::table('meetings')
                    ->where('id', $meetingId)
                    ->update(['participant_count' => $participantCount]);
            }
        }
    }
}
