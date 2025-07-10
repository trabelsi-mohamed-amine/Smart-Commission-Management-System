<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypologySeeder extends Seeder
{
    public function run(): void
    {
        $typologies = [
            [
                'title' => 'Ordinaire',
                'description' => 'Réunion régulière planifiée',
                'icon' => 'calendar'
            ],
            [
                'title' => 'Extraordinaire',
                'description' => 'Réunion spéciale convoquée pour des sujets urgents',
                'icon' => 'exclamation-circle'
            ],
            [
                'title' => 'Conseil',
                'description' => 'Réunion des membres du conseil d\'administration',
                'icon' => 'users'
            ],
            [
                'title' => 'Workshop',
                'description' => 'Session de travail collaboratif',
                'icon' => 'laptop'
            ]
        ];

     foreach ($typologies as $typology) {
    DB::table('typologies')->insert([
        'title' => $typology['title'],
        'description' => $typology['description'],
        'icon' => $typology['icon'], // Changed from 'img' to 'icon'
        'created_at' => now(),
        'updated_at' => now(),
    ]);
        }
    }
}
