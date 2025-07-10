<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    // Define role constants
    const ROLE_ADMIN = 'administrator';
    const ROLE_COMMISSION_MANAGER = 'commission_manager';
    const ROLE_COMMISSION_MEMBER = 'commission_member';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@smartmeet.com',
            'password' => Hash::make('password'),
            'role' => self::ROLE_ADMIN,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Commission managers
        $managers = [
            ['name' => 'Sarah Manager', 'email' => 'sarah@smartmeet.com'],
            ['name' => 'Ahmed Director', 'email' => 'ahmed@smartmeet.com'],
            ['name' => 'Fatima Lead', 'email' => 'fatima@smartmeet.com'],
        ];

        foreach ($managers as $manager) {
            DB::table('users')->insert([
                'name' => $manager['name'],
                'email' => $manager['email'],
                'password' => Hash::make('password'),
                'role' => self::ROLE_COMMISSION_MANAGER,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        // Commission members
        $members = [
            ['name' => 'Youssef Member', 'email' => 'youssef@smartmeet.com'],
            ['name' => 'Leila Analyst', 'email' => 'leila@smartmeet.com'],
            ['name' => 'Karim Consultant', 'email' => 'karim@smartmeet.com'],
            ['name' => 'Nadia Expert', 'email' => 'nadia@smartmeet.com'],
            ['name' => 'Omar Representative', 'email' => 'omar@smartmeet.com'],
            ['name' => 'Samira Member', 'email' => 'samira@smartmeet.com'],
            ['name' => 'Yasmine Specialist', 'email' => 'yasmine@smartmeet.com'],
        ];

        foreach ($members as $member) {
            DB::table('users')->insert([
                'name' => $member['name'],
                'email' => $member['email'],
                'password' => Hash::make('password'),
                'role' => self::ROLE_COMMISSION_MEMBER,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
