<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommissionSeeder extends Seeder
{
    public function run(): void
    {
        // Get commission manager IDs
        $managerIds = DB::table('users')
            ->where('role', '=', 'commission_manager')
            ->pluck('id')
            ->toArray();

        $commissions = [
            [
                'name' => 'Commission budgétaire 2025',
                'description' => 'Allocation et suivi du budget annuel'
            ],
            [
                'name' => 'Commission d\'audit interne',
                'description' => 'Audit des processus financiers'
            ],
            [
                'name' => 'Commission infrastructure IT',
                'description' => 'Modernisation de l\'infrastructure technique'
            ],
            [
                'name' => 'Commission stratégique',
                'description' => 'Stratégie et vision du second trimestre'
            ],
            [
                'name' => 'Commission RH',
                'description' => 'Recrutement et gestion des ressources humaines'
            ]
        ];

        foreach ($commissions as $commission) {
            DB::table('commissions')->insert([
                'name' => $commission['name'],
                'description' => $commission['description'],
                'manager_id' => $managerIds[array_rand($managerIds)],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
