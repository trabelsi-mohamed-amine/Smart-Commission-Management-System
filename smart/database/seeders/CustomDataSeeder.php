<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CustomDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add new commissions
        $commissions = [
            [
                'name' => 'Commission RH 2025',
                'description' => 'Gestion des ressources humaines et stratégie de recrutement'
            ],
            [
                'name' => 'Commission Marketing Digital',
                'description' => 'Stratégie marketing numérique et analyse de performance'
            ],
            [
                'name' => 'Commission Innovation Produit',
                'description' => 'Recherche et développement de nouvelles solutions'
            ],
            [
                'name' => 'Commission Développement International',
                'description' => 'Expansion des activités à l\'international'
            ],
            [
                'name' => 'Commission Transformation Numérique',
                'description' => 'Accompagnement de la transition numérique de l\'entreprise'
            ]
        ];

        echo "Seeding commissions...\n";

        $commissionIds = [];

        foreach ($commissions as $commission) {
            $id = DB::table('commissions')->insertGetId([
                'name' => $commission['name'],
                'description' => $commission['description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $commissionIds[] = $id;
            echo "Added commission: {$commission['name']}\n";
        }

        // Add meetings for each new commission
        echo "Seeding meetings...\n";

        foreach ($commissionIds as $commissionId) {
            $commission = DB::table('commissions')->where('id', $commissionId)->first();

            // Add 2-4 meetings per commission
            $meetingCount = rand(2, 4);

            for ($i = 0; $i < $meetingCount; $i++) {
                // Generate dates between current and next 60 days
                $daysToAdd = rand(1, 60);
                $date = Carbon::now()->addDays($daysToAdd)->format('Y-m-d');

                // Generate time between 9AM and 5PM
                $hour = rand(9, 17);
                $minute = rand(0, 11) * 5; // 5-minute intervals
                $time = sprintf("%02d:%02d:00", $hour, $minute);

                $meetingTitle = match ($i) {
                    0 => "Réunion de lancement - {$commission->name}",
                    1 => "Réunion de suivi - {$commission->name}",
                    2 => "Réunion de planification - {$commission->name}",
                    3 => "Réunion de clôture - {$commission->name}",
                    default => "Réunion " . ($i+1) . " - {$commission->name}",
                };

                DB::table('meetings')->insert([
                    'title' => $meetingTitle,
                    'description' => "Ordre du jour pour {$meetingTitle} le {$date} à {$time}",
                    'commission_id' => $commissionId,
                    'date' => $date,
                    'time' => $time,
                    'participant_count' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                echo "Added meeting: {$meetingTitle} for commission ID {$commissionId}\n";
            }
        }

        echo "Custom seeding completed successfully!\n";
    }
}
