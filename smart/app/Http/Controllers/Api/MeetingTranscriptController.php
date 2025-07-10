<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MeetingTranscript;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MeetingTranscriptController extends Controller
{
    // Get all transcripts
    public function index()
    {
        $transcripts = MeetingTranscript::with('meeting')->get();
        return response()->json($transcripts);
    }

    // Create a new transcript
    public function store(Request $request)
    {
        // Check authentication and log details for debugging
        if (!Auth::check()) {
            \Log::warning('Unauthenticated transcript creation attempt', [
                'headers' => $request->header(),
                'has_bearer_token' => $request->bearerToken() ? true : false
            ]);
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Get current user
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'meeting_id' => 'required|exists:meetings,id',
            'title'      => 'required|string|max:255',
            'content'    => 'required|string',
            'summary'    => 'required|string',
            'decisions'  => 'required|string',
            'actions'    => 'required|string',
            'file'       => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('meeting_transcripts', 'public');
        }

        // If user is a commission_member, always set status to 'en attente'
        $status = 'en attente';

        // Only commission_manager or administrator can set a different status directly
        if (($user->role === 'commission_manager' || $user->role === 'administrator') && $request->has('status')) {
            $status = $request->status;
        }

        $transcript = MeetingTranscript::create([
            'meeting_id' => $request->meeting_id,
            'title'      => $request->title,
            'content'    => $request->content,
            'summary'    => $request->summary,
            'decisions'  => $request->decisions,
            'actions'    => $request->actions,
            'status'     => $status,
            'file_path'  => $filePath,
            'created_by' => $user->id,
        ]);

        return response()->json(['message' => 'Transcript créé avec succès', 'data' => $transcript], 201);
    }

    // Get a specific transcript
    public function show($id)
    {
        $transcript = MeetingTranscript::with('meeting')->findOrFail($id);
        return response()->json($transcript);
    }

    // Update an existing transcript
    public function update(Request $request, $id)
    {
        // Check authentication
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $transcript = MeetingTranscript::findOrFail($id);
        $user = auth()->user();        // Commission members can only update their own transcripts that are either in 'en attente' or 'rejeté' status
        if ($user->role === 'commission_member') {
            // Some existing transcripts might not have created_by set
            // Only check ownership if created_by is not null
            if ($transcript->created_by !== null && $transcript->created_by != $user->id) {
                return response()->json([
                    'message' => 'Vous ne pouvez pas modifier un transcript créé par un autre utilisateur.'
                ], 403);
            }

            // If created_by is null, let's update it to the current user
            if ($transcript->created_by === null) {
                $transcript->created_by = $user->id;
                $transcript->save();
            }

            // Check if transcript is already approved
            if ($transcript->status === 'approuvé') {
                return response()->json([
                    'message' => 'Vous ne pouvez pas modifier un transcript déjà approuvé.'
                ], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'meeting_id' => 'required|exists:meetings,id',
            'title'      => 'required|string|max:255',
            'content'    => 'required|string',
            'summary'    => 'required|string',
            'decisions'  => 'required|string',
            'actions'    => 'required|string',
            'file'       => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('file')) {
            // Delete old file if it exists
            if ($transcript->file_path && Storage::disk('public')->exists($transcript->file_path)) {
                Storage::disk('public')->delete($transcript->file_path);
            }

            $transcript->file_path = $request->file('file')->store('meeting_transcripts', 'public');
        }

        // If commission member updates a rejected transcript, set status back to 'en attente'
        $status = $transcript->status;
        if ($user->role === 'commission_member' && $transcript->status === 'rejeté') {
            $status = 'en attente';
        }
        // Only commission_manager or administrator can directly set status
        elseif (($user->role === 'commission_manager' || $user->role === 'administrator') && $request->has('status')) {
            $status = $request->status;
        }

        $transcript->update([
            'meeting_id' => $request->meeting_id,
            'title'      => $request->title,
            'content'    => $request->content,
            'summary'    => $request->summary,
            'decisions'  => $request->decisions,
            'actions'    => $request->actions,
            'status'     => $status,
        ]);

        return response()->json(['message' => 'Transcript mis à jour avec succès', 'data' => $transcript]);
    }

    // Delete a transcript
    public function destroy($id)
    {
        // Get current user
        $user = auth()->user();
        $transcript = MeetingTranscript::findOrFail($id);

        // Commission members can only delete their own transcripts that are in 'en attente' or 'rejeté' status
        if ($user->role === 'commission_member') {
            // Check if transcript was created by this user
            if ($transcript->created_by !== $user->id) {
                return response()->json([
                    'message' => 'Vous ne pouvez pas supprimer un transcript créé par un autre utilisateur.'
                ], 403);
            }

            // Check if transcript is already approved
            if ($transcript->status === 'approuvé') {
                return response()->json([
                    'message' => 'Vous ne pouvez pas supprimer un transcript déjà approuvé.'
                ], 403);
            }
        } elseif (!in_array($user->role, ['commission_manager', 'administrator'])) {
            return response()->json([
                'message' => 'Vous n\'avez pas les permissions nécessaires pour supprimer ce transcript.'
            ], 403);
        }

        if ($transcript->file_path && Storage::disk('public')->exists($transcript->file_path)) {
            Storage::disk('public')->delete($transcript->file_path);
        }

        $transcript->delete();

        return response()->json(['message' => 'Transcript supprimé avec succès']);
    }

    // Validate a transcript (for administrators only)
    public function validate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approuvé,rejeté',
            'feedback' => 'nullable|string|max:1000', // Optional feedback, especially for rejections
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $transcript = MeetingTranscript::findOrFail($id);

        // Get current user
        $user = auth()->user();

        // Check if user is an administrator
        if ($user && $user->role !== 'administrator') {
            return response()->json(['message' => 'Unauthorized. Only administrators can validate transcripts.'], 403);
        }

        // Include feedback in the update if provided
        $updateData = [
            'status' => $request->status,
            'validated_by' => $user->id,
            'validated_at' => now(),
        ];

        if ($request->has('feedback')) {
            $updateData['feedback'] = $request->feedback;
        }

        $transcript->update($updateData);

        return response()->json([
            'message' => 'Statut du transcript mis à jour avec succès',
            'data' => $transcript
        ]);
    }

    // Get transcripts for a specific meeting
    public function getByMeeting($meetingId)
    {
        $transcripts = MeetingTranscript::with('meeting')
                    ->where('meeting_id', $meetingId)
                    ->get();

        return response()->json($transcripts);
    }

    /**
     * Resubmit a rejected transcript (specifically for commission members)
     */
    public function resubmit(Request $request, $id)
    {
        // Check authentication
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = auth()->user();
        $transcript = MeetingTranscript::findOrFail($id);

        // Only commission members can use this endpoint
        if ($user->role !== 'commission_member') {
            return response()->json([
                'message' => 'Cette fonctionnalité est réservée aux membres de commission.'
            ], 403);
        }

        // Some existing transcripts might not have created_by set
        // Only check ownership if created_by is not null
        if ($transcript->created_by !== null && $transcript->created_by != $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas modifier un transcript créé par un autre utilisateur.'
            ], 403);
        }

        // If created_by is null, let's update it to the current user
        if ($transcript->created_by === null) {
            $transcript->created_by = $user->id;
            $transcript->save();
        }

        // Check if transcript is rejected
        if ($transcript->status !== 'rejeté') {
            return response()->json([
                'message' => 'Seuls les transcripts rejetés peuvent être soumis à nouveau.'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'title'      => 'required|string|max:255',
            'content'    => 'required|string',
            'summary'    => 'required|string',
            'decisions'  => 'required|string',
            'actions'    => 'required|string',
            'file'       => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('file')) {
            // Delete old file if it exists
            if ($transcript->file_path && Storage::disk('public')->exists($transcript->file_path)) {
                Storage::disk('public')->delete($transcript->file_path);
            }

            $transcript->file_path = $request->file('file')->store('meeting_transcripts', 'public');
        }

        $transcript->update([
            'title'      => $request->title,
            'content'    => $request->content,
            'summary'    => $request->summary,
            'decisions'  => $request->decisions,
            'actions'    => $request->actions,
            'status'     => 'en attente',
        ]);

        return response()->json([
            'message' => 'Transcript soumis à nouveau avec succès',
            'data' => $transcript
        ]);
    }
}
