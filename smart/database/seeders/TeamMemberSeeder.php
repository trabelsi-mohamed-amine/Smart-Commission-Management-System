<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teamMembers = [
            [
                'name' => 'Ahmed Benali',
                'role' => 'Directeur Général',
                'description' => 'Plus de 15 ans d\'expérience dans la direction d\'entreprises technologiques',
                'img' => 'team-members/ahmed.jpg'
            ],
            [
                'name' => 'Fatima Zahra',
                'role' => 'Directrice Marketing',
                'description' => 'Spécialiste en stratégie digitale et communication corporate',
                'img' => 'team-members/fatima.jpg'
            ],
            [
                'name' => 'Karim Idrissi',
                'role' => 'Lead Developer',
                'description' => 'Expert en développement web et applications mobiles',
                'img' => 'team-members/karim.jpg'
            ],
            [
                'name' => 'Leila Bennani',
                'role' => 'Responsable RH',
                'description' => 'Passionnée par le développement des talents et la culture d\'entreprise',
                'img' => 'team-members/leila.jpg'
            ],
            [
                'name' => 'Youssef Alami',
                'role' => 'Directeur Financier',
                'description' => 'Certifié CPA avec une expertise en gestion financière d\'entreprises tech',
                'img' => 'team-members/youssef.jpg'
            ]
        ];

        foreach ($teamMembers as $member) {
            DB::table('team_members')->insert([
                'name' => $member['name'],
                'role' => $member['role'],
                'description' => $member['description'],
                'img' => $member['img'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
