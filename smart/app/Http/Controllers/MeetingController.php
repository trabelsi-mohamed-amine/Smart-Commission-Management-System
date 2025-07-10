<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Commission;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    /**
     * Add a participant to a meeting
     */
    public function addParticipant(Request $request, Meeting $meeting)
    {
        // Validate request
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Check if user is already a participant
        if ($meeting->isUserParticipant($request->user_id)) {
            return response()->json([
                'message' => 'User is already a participant in this meeting'
            ], 422);
        }

        // Add user as participant
        $meeting->participants()->create([
            'user_id' => $request->user_id
        ]);

        // Update participant count
        $meeting->increment('participant_count');

        return response()->json([
            'message' => 'Participant added successfully',
            'meeting' => $meeting->fresh()
        ]);
    }

    /**
     * Remove a participant from a meeting
     */
    public function removeParticipant(Request $request, Meeting $meeting)
    {
        // Validate request
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Check if user is a participant
        if (!$meeting->isUserParticipant($request->user_id)) {
            return response()->json([
                'message' => 'User is not a participant in this meeting'
            ], 422);
        }

        // Remove user as participant
        $meeting->participants()->where('user_id', $request->user_id)->delete();

        // Update participant count
        $meeting->decrement('participant_count');

        return response()->json([
            'message' => 'Participant removed successfully',
            'meeting' => $meeting->fresh()
        ]);
    }

    /**
     * Get all participants of a meeting
     */
    public function getParticipants(Meeting $meeting)
    {
        $participants = $meeting->participants()->with('user')->get();

        return response()->json([
            'participants' => $participants
        ]);
    }

    // Afficher le formulaire de création de réunion
    public function create()
    {
        $commissions = Commission::all(); // Récupérer toutes les commissions
        return view('meetings.create', compact('commissions')); // Passer les commissions à la vue
    }

    // Enregistrer une nouvelle réunion
    public function store(Request $request)
    {
        // Valider les données du formulaire
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'commission_id' => 'required|exists:commissions,id', // Vérifie que l'ID de la commission existe
            'date_time' => 'required|date',
        ]);

        // Créer et enregistrer la réunion
        Meeting::create([
            'title' => $request->title,
            'description' => $request->description,
            'commission_id' => $request->commission_id, // Associe la commission à la réunion
            'date_time' => $request->date_time,
        ]);

        return redirect()->route('meetings.index')->with('success', 'Réunion créée avec succès!');
    }

    // Afficher la liste des réunions (optionnel, pour afficher les réunions)
    public function index()
    {
        $meetings = Meeting::with('commission')->get(); // Récupérer toutes les réunions avec la commission associée
        return view('meetings.index', compact('meetings'));
    }
}
