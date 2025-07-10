<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First seed the department teams
        $teams = [
            ['name' => 'Département Finance', 'description' => 'Gestion financière et comptable'],
            ['name' => 'Département IT', 'description' => 'Technologies de l\'information'],
            ['name' => 'Département Marketing', 'description' => 'Communication et stratégie marketing'],
            ['name' => 'Département RH', 'description' => 'Gestion des ressources humaines'],
            ['name' => 'Direction générale', 'description' => 'Comité exécutif et direction'],
            ['name' => 'R&D', 'description' => 'Recherche et développement'],
            ['name' => 'Service juridique', 'description' => 'Affaires légales et compliance'],
            ['name' => 'Service client', 'description' => 'Support et satisfaction client'],
            ['name' => 'Production', 'description' => 'Opérations et production'],
            ['name' => 'Logistique', 'description' => 'Supply chain et logistique']
        ];

        foreach ($teams as $team) {
            DB::table('teams')->insert([
                'name' => $team['name'],
                'description' => $team['description'],
                'role' => 'department', // Adding the required role field
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
