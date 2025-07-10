<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingParticipant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MeetingParticipantController extends Controller
{
    /**
     * Add a participant to a meeting
     */
    public function addParticipant(Request $request, $meetingId)
    {
        try {
            $user = Auth::user();
            if (!$user || !in_array($user->role, ['administrator', 'commission_manager'])) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $request->validate([
                'user_id' => 'required|exists:users,id'
            ]);

            $meeting = Meeting::findOrFail($meetingId);
            $participantUser = User::findOrFail($request->user_id);

            // Check if user is already a participant
            if ($meeting->isUserParticipant($participantUser->id)) {
                return response()->json(['message' => 'User is already a participant'], 400);
            }

            DB::beginTransaction();

            // Add participant
            MeetingParticipant::create([
                'meeting_id' => $meetingId,
                'user_id' => $participantUser->id
            ]);

            // Increment participant count
            $meeting->increment('participant_count');

            DB::commit();

            return response()->json([
                'message' => 'Participant added successfully',
                'participant_count' => $meeting->participant_count
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding participant: ' . $e->getMessage());
            return response()->json(['message' => 'Error adding participant'], 500);
        }
    }

    /**
     * Remove a participant from a meeting
     */
    public function removeParticipant(Request $request, $meetingId, $userId)
    {
        try {
            $user = Auth::user();
            if (!$user || !in_array($user->role, ['administrator', 'commission_manager'])) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $meeting = Meeting::findOrFail($meetingId);

            // Check if user is a participant
            if (!$meeting->isUserParticipant($userId)) {
                return response()->json(['message' => 'User is not a participant'], 400);
            }

            DB::beginTransaction();

            // Remove participant
            MeetingParticipant::where('meeting_id', $meetingId)
                ->where('user_id', $userId)
                ->delete();

            // Decrement participant count
            if ($meeting->participant_count > 0) {
                $meeting->decrement('participant_count');
            }

            DB::commit();

            return response()->json([
                'message' => 'Participant removed successfully',
                'participant_count' => $meeting->participant_count
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error removing participant: ' . $e->getMessage());
            return response()->json(['message' => 'Error removing participant'], 500);
        }
    }

    /**
     * Leave a meeting
     *
     * @param Request $request
     * @param int $meetingId
     * @return \Illuminate\Http\JsonResponse
     */
    public function leave($meetingId)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $meeting = Meeting::findOrFail($meetingId);

            // Check if user is already a participant
            if (!$meeting->isUserParticipant($user->id)) {
                return response()->json(['message' => 'Vous ne participez pas à cette réunion'], 400);
            }

            DB::beginTransaction();

            // Remove participant
            MeetingParticipant::where('meeting_id', $meetingId)
                ->where('user_id', $user->id)
                ->delete();

            // Decrement participant count (ensure it doesn't go below 0)
            if ($meeting->participant_count > 0) {
                $meeting->decrement('participant_count');
            }

            DB::commit();

            return response()->json([
                'message' => 'Vous avez quitté la réunion avec succès',
                'participant_count' => $meeting->participant_count
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error leaving meeting: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la sortie de la réunion'], 500);
        }
    }

    /**
     * Get participants for a meeting
     *
     * @param int $meetingId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getParticipants($meetingId)
    {
        try {
            $meeting = Meeting::findOrFail($meetingId);

            $participants = MeetingParticipant::where('meeting_id', $meetingId)
                ->with('user:id,name,email,role') // Only get necessary user fields
                ->get()
                ->map(function($participant) {
                    return [
                        'id' => $participant->user->id,
                        'name' => $participant->user->name,
                        'email' => $participant->user->email,
                        'role' => $participant->user->role,
                        'joined_at' => $participant->created_at
                    ];
                });            return response()->json([
                'participants' => $participants
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting meeting participants: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la récupération des participants'], 500);
        }
    }

    /**
     * Join a meeting
     *
     * @param int $meetingId
     * @return \Illuminate\Http\JsonResponse
     */
    public function join($meetingId)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $meeting = Meeting::findOrFail($meetingId);

            // Check if user is already a participant
            if ($meeting->isUserParticipant($user->id)) {
                return response()->json(['message' => 'Vous participez déjà à cette réunion'], 400);
            }

            DB::beginTransaction();

            // Add participant
            MeetingParticipant::create([
                'meeting_id' => $meetingId,
                'user_id' => $user->id
            ]);

            // Increment participant count
            $meeting->increment('participant_count');

            DB::commit();

            return response()->json([
                'message' => 'Vous avez rejoint la réunion avec succès',
                'participant_count' => $meeting->participant_count
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error joining meeting: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la participation à la réunion'], 500);
        }
    }
}
