<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Meeting;
use Illuminate\Support\Facades\Log;

class MeetingController extends Controller
{
    public function index()
    {
        try {
            $meetings = Meeting::with('commission')->get();

            // If user is authenticated, add participation status
            if (auth()->check()) {
                $user = auth()->user();
                Log::info("Fetching meetings for user: {$user->id}, Role: {$user->role}");

                // Add user-specific participation info
                $meetings->transform(function($meeting) use ($user) {
                    // Check if the user is a participant
                    $isParticipant = $meeting->isUserParticipant($user->id);
                    $meeting->current_user_status = $isParticipant ? 'joined' : null;

                    // participant_count is now stored in the database

                    Log::info("Meeting {$meeting->id}: User participation status: " .
                        ($isParticipant ? 'joined' : 'not joined') .
                        ", Participant count: {$meeting->participant_count}");

                    return $meeting;
                });
            }

            return response()->json($meetings);
        } catch (\Exception $e) {
            Log::error("Meeting fetch error: " . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la récupération des réunions'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            // Check if user is commission_member
            if (auth()->check() && auth()->user()->role === 'commission_member') {
                return response()->json([
                    'message' => 'Non autorisé. Les membres de la commission ne peuvent pas créer de réunions.'
                ], 403);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'commission_id' => 'required|exists:commissions,id',
                'date' => 'required|date',
                'time' => 'required|date_format:H:i'
            ]);

            $meeting = Meeting::create($validated);
            $meeting->load('commission'); // ✅ charger la relation

            return response()->json($meeting, 201); // ✅ retourner le modèle complet
        } catch (\Exception $e) {
            Log::error("Meeting creation error: " . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la création de la réunion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $meeting = Meeting::with('commission')->findOrFail($id);

            // If user is authenticated, include their participation status
            if (auth()->check()) {
                $user = auth()->user();

                // Check if the user is a participant
                $isParticipant = $meeting->isUserParticipant($user->id);
                $meeting->current_user_status = $isParticipant ? 'joined' : null;

                Log::info("Show meeting {$id}: User participation status: " .
                    ($isParticipant ? 'joined' : 'not joined') .
                    ", Participant count: {$meeting->participant_count}");
            }

            return response()->json($meeting);
        } catch (\Exception $e) {
            Log::error("Meeting fetch error: " . $e->getMessage());
            return response()->json([
                'message' => 'Réunion non trouvée'
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Check if user is commission_member
            if (auth()->check() && auth()->user()->role === 'commission_member') {
                return response()->json([
                    'message' => 'Non autorisé. Les membres de la commission ne peuvent pas modifier de réunions.'
                ], 403);
            }

            $meeting = Meeting::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'commission_id' => 'required|exists:commissions,id',
                'date' => 'required|date',
                'time' => 'required|date_format:H:i'
            ]);

            $meeting->update($validated);
            $meeting->load('commission');

            return response()->json($meeting);
        } catch (\Exception $e) {
            Log::error("Meeting update error: " . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }    public function destroy($id)
    {
        try {
            // Check if user is commission_member
            if (auth()->check() && auth()->user()->role === 'commission_member') {
                return response()->json([
                    'message' => 'Non autorisé. Les membres de la commission ne peuvent pas supprimer de réunions.'
                ], 403);
            }

            $meeting = Meeting::findOrFail($id);
            $meeting->delete();

            return response()->json(['message' => 'Réunion supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error("Meeting delete error: " . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de la suppression'
            ], 500);
        }
    }

    // Removed meeting participation-related methods
}
