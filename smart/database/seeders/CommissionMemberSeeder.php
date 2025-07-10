<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommissionMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get commission member IDs
        $memberIds = DB::table('users')
            ->where('role', '=', 'commission_member')
            ->pluck('id')
            ->toArray();

        // Get all commissions
        $commissions = DB::table('commissions')->get();

        // Assign members to commissions
        foreach ($commissions as $commission) {
            // Randomly select 1-3 members for each commission
            $selectedMemberCount = rand(1, min(3, count($memberIds)));
            $shuffledMembers = $memberIds;
            shuffle($shuffledMembers);
            $selectedMembers = array_slice($shuffledMembers, 0, $selectedMemberCount);

            foreach ($selectedMembers as $memberId) {
                // Check if the relationship already exists
                $exists = DB::table('commission_members')
                    ->where('commission_id', $commission->id)
                    ->where('user_id', $memberId)
                    ->exists();

                if (!$exists) {
                    DB::table('commission_members')->insert([
                        'commission_id' => $commission->id,
                        'user_id' => $memberId,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
    }
}
