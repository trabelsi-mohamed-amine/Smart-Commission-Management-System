<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Module;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            [
                'title' => 'Gestion des réunions',
                'description' => 'Planifiez, organisez et suivez vos réunions efficacement avec des outils de collaboration intégrés',
                'icon' => 'FaCalendarAlt',
                'color' => '#3b82f6'
            ],
            [
                'title' => 'Gestion des commissions',
                'description' => 'Créez et gérez des commissions avec leurs membres, rôles et responsabilités',
                'icon' => 'FaUsers',
                'color' => '#10b981'
            ],
            [
                'title' => 'Procès-verbaux',
                'description' => 'Générez et partagez automatiquement des procès-verbaux suite à vos réunions',
                'icon' => 'FaFileAlt',
                'color' => '#f59e0b'
            ],
            [
                'title' => 'Suivi des décisions',
                'description' => 'Assignez, tracez et complétez les actions décidées lors des réunions',
                'icon' => 'FaCheckCircle',
                'color' => '#8b5cf6'
            ],
            [
                'title' => 'Tableau de bord analytique',
                'description' => 'Visualisez des statistiques et indicateurs clés pour optimiser vos processus',
                'icon' => 'FaChartBar',
                'color' => '#ec4899'
            ],
            [
                'title' => 'Notifications intelligentes',
                'description' => 'Recevez des alertes personnalisées pour les événements importants',
                'icon' => 'FaBell',
                'color' => '#ef4444'
            ]
        ];

        foreach ($modules as $module) {
            DB::table('modules')->insert([
                'title' => $module['title'],
                'description' => $module['description'],
                'icon' => $module['icon'],
                'color' => $module['color'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
