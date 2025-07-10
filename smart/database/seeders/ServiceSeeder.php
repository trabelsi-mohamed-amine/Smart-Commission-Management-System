<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Ajoute ici l'instance du service avec la colonne 'color' spécifiée
        Service::create([
            'title' => 'Service Exemple',
            'description' => 'Description exemple',
            'icon' => 'bi-gear',
            'color' => '#ff0000', // Ajoute la valeur pour la colonne 'color'
        ]);

        // Tu peux ajouter plus d'exemples si nécessaire
        Service::create([
            'title' => 'Service Avancé',
            'description' => 'Description d’un service avancé',
            'icon' => 'bi-lightning',
            'color' => '#00ff00',
        ]);
    }
}
