<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,    // Then create users with roles
            CommissionSeeder::class,  // Then create commissions with managers
            CommissionMemberSeeder::class, // Assign members to commissions
            MeetingSeeder::class,     // Finally create meetings with participants
            TeamSeeder::class,        // Create department teams
            TeamMemberSeeder::class,  // Create team members for team_members table
            TeamMembersDataSeeder::class, // Create team members for teams table
        ]);
    }
}
