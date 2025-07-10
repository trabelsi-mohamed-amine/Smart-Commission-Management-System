<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamMembersDataSeeder extends Seeder
{
    /**
     * Run the database seeds for the members in the teams table.
     */
    public function run(): void
    {
        $teamMembers = [
            [
                'name' => 'Mohammed Tazi',
                'role' => 'Directeur Technique',
                'description' => 'Expert en architecture logicielle et innovation technologique',
                'image' => 'team-images/mohammed.jpg'
            ],
            [
                'name' => 'Samira Radi',
                'role' => 'UX/UI Designer',
                'description' => 'Passionnée par l\'expérience utilisateur et le design d\'interfaces',
                'image' => 'team-images/samira.jpg'
            ],
            [
                'name' => 'Rachid Mansouri',
                'role' => 'DevOps Engineer',
                'description' => 'Spécialiste en intégration continue et déploiement automatisé',
                'image' => 'team-images/rachid.jpg'
            ],
            [
                'name' => 'Nadia El Fassi',
                'role' => 'Product Manager',
                'description' => 'Experte en gestion de produit et développement agile',
                'image' => 'team-images/nadia.jpg'
            ],
            [
                'name' => 'Omar Chaoui',
                'role' => 'Data Scientist',
                'description' => 'Spécialiste en analyse de données et intelligence artificielle',
                'image' => 'team-images/omar.jpg'
            ]
        ];

        foreach ($teamMembers as $member) {
            DB::table('teams')->insert([
                'name' => $member['name'],
                'role' => $member['role'],
                'description' => $member['description'],
                'image' => $member['image'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
