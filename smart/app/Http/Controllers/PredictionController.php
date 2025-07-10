<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Meeting;
use Illuminate\Support\Facades\DB;

class PredictionController extends Controller
{
    // Méthode pour la courbe de prédiction
    public function getPrediction()
    {
        $meetingsByMonth = Meeting::select(
            DB::raw("MONTH(start_date) as month"),
            DB::raw("COUNT(*) as meetings")
        )
        ->whereYear('start_date', now()->year)
        ->groupBy(DB::raw("MONTH(start_date)"))
        ->get()
        ->pluck('meetings', 'month'); // Format clé => valeur

        $months = [
            1 => 'Janvier', 2 => 'Février', 3 => 'Mars',
            4 => 'Avril', 5 => 'Mai', 6 => 'Juin',
            7 => 'Juillet', 8 => 'Août', 9 => 'Septembre',
            10 => 'Octobre', 11 => 'Novembre', 12 => 'Décembre'
        ];

        $formatted = [];
        foreach ($months as $num => $name) {
            $formatted[] = [
                'month' => $name,
                'meetings' => $meetingsByMonth[$num] ?? 0,
            ];
        }

        return response()->json($formatted);
    }

    // Méthode pour compter les réunions de l'année en cours
    public function countMeetingsThisYear()
    {
        $count = Meeting::whereYear('start_date', now()->year)->count();

        return response()->json([
            'year' => now()->year,
            'total_meetings' => $count,
        ]);
    }
}
