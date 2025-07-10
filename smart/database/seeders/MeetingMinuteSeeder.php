<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeetingMinuteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all completed meetings
        $completedMeetings = DB::table('meetings')
            ->where('status', 'completed')
            ->get();

        foreach ($completedMeetings as $meeting) {
            // Generate between 3-8 discussion points per meeting
            $pointCount = rand(3, 8);

            // Create the meeting minutes record
            $minuteId = DB::table('meeting_minutes')->insertGetId([
                'meeting_id' => $meeting->id,
                'summary' => "Procès verbal de la réunion: " . $meeting->title,
                'created_by' => rand(2, 4), // Manager IDs (2-4)
                'created_at' => $meeting->end_date,
                'updated_at' => $meeting->end_date,
            ]);

            // Create discussion points
            for ($i = 0; $i < $pointCount; $i++) {
                $pointType = ['discussion', 'decision', 'action'][rand(0, 2)];

                $point = [
                    'minute_id' => $minuteId,
                    'type' => $pointType,
                    'title' => $this->getPointTitle($pointType, $i),
                    'description' => $this->getPointDescription($pointType),
                    'created_at' => $meeting->end_date,
                    'updated_at' => $meeting->end_date,
                ];

                $pointId = DB::table('discussion_points')->insertGetId($point);

                // If this is an action point, assign it to someone
                if ($pointType === 'action') {
                    // Get commission members
                    $commission = DB::table('commissions')->where('id', $meeting->commission_id)->first();
                    $members = DB::table('commission_members')
                        ->where('commission_id', $commission->id)
                        ->get()
                        ->pluck('user_id')
                        ->toArray();

                    // If no members found, use a fallback
                    if (empty($members)) {
                        $members = [5, 6, 7, 8, 9];
                    }

                    $assignedTo = $members[array_rand($members)];
                    $dueDate = date('Y-m-d', strtotime($meeting->end_date . ' + ' . rand(7, 30) . ' days'));

                    DB::table('action_items')->insert([
                        'point_id' => $pointId,
                        'assigned_to' => $assignedTo,
                        'due_date' => $dueDate,
                        'status' => ['pending', 'in_progress', 'completed'][rand(0, 2)],
                        'created_at' => $meeting->end_date,
                        'updated_at' => $meeting->end_date,
                    ]);
                }
            }
        }
    }

    private function getPointTitle($type, $index)
    {
        $discussionTitles = [
            'Présentation des résultats trimestriels',
            'Analyse de la concurrence',
            'Point sur l\'avancement des projets',
            'Feedback des clients',
            'État des lieux des équipes',
            'Revue des objectifs annuels',
            'Analyse des KPIs',
            'Discussions sur la stratégie',
            'Point sur le budget',
            'Évolution du marché'
        ];

        $decisionTitles = [
            'Validation du budget marketing',
            'Décision sur le recrutement',
            'Choix du fournisseur',
            'Approbation de la nouvelle stratégie',
            'Validation du plan d\'action',
            'Décision sur l\'investissement',
            'Choix technologique',
            'Validation du planning',
            'Décision sur la politique tarifaire',
            'Approbation du nouveau processus'
        ];

        $actionTitles = [
            'Préparer le rapport financier',
            'Contacter les fournisseurs',
            'Finaliser le document de présentation',
            'Organiser l\'événement de lancement',
            'Préparer la communication interne',
            'Mettre à jour la documentation',
            'Réaliser l\'étude de marché',
            'Former les équipes',
            'Mettre en place le nouveau processus',
            'Préparer le pitch pour les investisseurs'
        ];

        switch ($type) {
            case 'discussion':
                return $discussionTitles[$index % count($discussionTitles)];
            case 'decision':
                return $decisionTitles[$index % count($decisionTitles)];
            case 'action':
                return $actionTitles[$index % count($actionTitles)];
            default:
                return 'Point de discussion #' . ($index + 1);
        }
    }

    private function getPointDescription($type)
    {
        $discussionDescriptions = [
            'Les participants ont discuté des résultats et ont noté une progression significative par rapport au trimestre précédent.',
            'Une analyse approfondie des forces et faiblesses de la concurrence a été présentée par l\'équipe marketing.',
            'Chaque responsable de projet a présenté l\'état d\'avancement et les éventuels obstacles rencontrés.',
            'L\'équipe a examiné les retours clients et a identifié plusieurs axes d\'amélioration prioritaires.',
            'Un point complet sur le fonctionnement des équipes a révélé quelques dysfonctionnements à corriger.'
        ];

        $decisionDescriptions = [
            'Après délibération, le comité a validé la proposition à l\'unanimité.',
            'La décision a été prise de procéder selon l\'option B, qui présente le meilleur rapport coût/bénéfice.',
            'Le comité a voté en faveur de la nouvelle stratégie qui sera implémentée dès le mois prochain.',
            'Il a été décidé de reporter cette décision à la prochaine réunion pour obtenir des informations complémentaires.',
            'La proposition a été acceptée sous réserve de modifications mineures qui devront être validées par email.'
        ];

        $actionDescriptions = [
            'Cette tâche devra être réalisée dans les délais impartis et présentée lors de la prochaine réunion.',
            'L\'action devra être coordonnée avec les équipes concernées pour assurer une mise en œuvre efficace.',
            'Un suivi hebdomadaire sera mis en place pour s\'assurer de l\'avancement de cette action prioritaire.',
            'Cette action s\'inscrit dans le cadre du projet global et représente une étape clé pour sa réussite.',
            'Un reporting détaillé devra être fourni une fois l\'action terminée.'
        ];

        switch ($type) {
            case 'discussion':
                return $discussionDescriptions[array_rand($discussionDescriptions)];
            case 'decision':
                return $decisionDescriptions[array_rand($decisionDescriptions)];
            case 'action':
                return $actionDescriptions[array_rand($actionDescriptions)];
            default:
                return 'Description du point discuté lors de la réunion.';
        }
    }
}
