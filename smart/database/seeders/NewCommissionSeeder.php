<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CommissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $commissions = [
            [
                'name' => 'Commission budgétaire 2025',
                'description' => 'Allocation et suivi du budget annuel',
                'category_id' => 1, // Commission des finances
                'team_id' => 1, // Département Finance
                'manager_id' => 2 // Sarah Manager
            ],
            [
                'name' => 'Commission d\'audit interne',
                'description' => 'Audit des processus financiers',
                'category_id' => 3, // Commission d'audit
                'team_id' => 1, // Département Finance
                'manager_id' => 3 // Ahmed Director
            ],
            [
                'name' => 'Commission infrastructure IT',
                'description' => 'Modernisation de l\'infrastructure technique',
                'category_id' => 2, // Commission technique
                'team_id' => 2, // Département IT
                'manager_id' => 4 // Fatima Lead
            ],
            [
                'name' => 'Comité de direction Q2 2025',
                'description' => 'Stratégie et vision du second trimestre',
                'category_id' => 4, // Comité de direction
                'team_id' => 5, // Direction générale
                'manager_id' => 2 // Sarah Manager
            ],
            [
                'name' => 'Commission recrutement senior',
                'description' => 'Recrutement de profils cadres',
                'category_id' => 5, // Commission RH
                'team_id' => 4, // Département RH
                'manager_id' => 3 // Ahmed Director
            ],
            [
                'name' => 'Commission développement produit',
                'description' => 'Développement de la nouvelle gamme',
                'category_id' => 8, // Commission de recherche
                'team_id' => 6, // R&D
                'manager_id' => 4 // Fatima Lead
            ],
            [
                'name' => 'Commission stratégie digitale',
                'description' => 'Transformation numérique de l\'entreprise',
                'category_id' => 6, // Commission marketing
                'team_id' => 3, // Département Marketing
                'manager_id' => 2 // Sarah Manager
            ],
            [
                'name' => 'Comité d\'éthique data',
                'description' => 'Utilisation éthique des données clients',
                'category_id' => 7, // Comité d'éthique
                'team_id' => 7, // Service juridique
                'manager_id' => 3 // Ahmed Director
            ],
            [
                'name' => 'Commission qualité service',
                'description' => 'Amélioration continue du service client',
                'category_id' => 2, // Commission technique (as placeholder)
                'team_id' => 8, // Service client
                'manager_id' => 4 // Fatima Lead
            ],
            [
                'name' => 'Commission réduction empreinte carbone',
                'description' => 'Stratégies écologiques pour l\'entreprise',
                'category_id' => 2, // Commission technique (as placeholder)
                'team_id' => 9, // Production
                'manager_id' => 2 // Sarah Manager
            ],
            [
                'name' => 'Commission optimisation supply chain',
                'description' => 'Amélioration des processus logistiques',
                'category_id' => 3, // Commission d'audit (as placeholder)
                'team_id' => 10, // Logistique
                'manager_id' => 3 // Ahmed Director
            ],
            [
                'name' => 'Commission budget marketing',
                'description' => 'Allocation des ressources marketing',
                'category_id' => 1, // Commission des finances
                'team_id' => 3, // Département Marketing
                'manager_id' => 4 // Fatima Lead
            ]
        ];

        foreach ($commissions as $commission) {
            $commissionId = DB::table('commissions')->insertGetId([
                'name' => $commission['name'],
                'description' => $commission['description'],
                'category_id' => $commission['category_id'],
                'team_id' => $commission['team_id'],
                'manager_id' => $commission['manager_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add members to each commission (3-5 members randomly)
            $memberCount = rand(3, 5);
            $memberIds = range(5, 11); // User IDs 5-11 are commission members
            shuffle($memberIds);
            $selectedMembers = array_slice($memberIds, 0, $memberCount);

            foreach ($selectedMembers as $memberId) {
                DB::table('commission_members')->insert([
                    'commission_id' => $commissionId,
                    'user_id' => $memberId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
