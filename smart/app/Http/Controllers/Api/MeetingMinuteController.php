<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MeetingMinute;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MeetingMinuteController extends Controller
{
    // 🟢 Afficher tous les procès-verbaux
    public function index()
    {
        $minutes = MeetingMinute::with('meeting')->get();
        return response()->json($minutes);
    }    // 🟢 Enregistrer un nouveau procès-verbal
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'meeting_id' => 'required|exists:meetings,id',
            'title'      => 'required|string|max:255',
            'content'    => 'required|string',
            'summary'    => 'required|string',
            'decisions'  => 'required|string',
            'actions'    => 'required|string',
            'status'     => 'required|in:en attente,approuvé,rejeté',
            'file'       => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('meeting_minutes', 'public');
        }

        $minute = MeetingMinute::create([
            'meeting_id' => $request->meeting_id,
            'title'      => $request->title,
            'content'    => $request->content,
            'summary'    => $request->summary,
            'decisions'  => $request->decisions,
            'actions'    => $request->actions,
            'status'     => $request->status,
            'file_path'  => $filePath,
        ]);

        return response()->json(['message' => 'Procès-verbal ajouté avec succès', 'data' => $minute]);
    }    // 🟢 Mettre à jour un procès-verbal existant
    public function update(Request $request, $id)
    {
        $minute = MeetingMinute::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'meeting_id' => 'required|exists:meetings,id',
            'title'      => 'required|string|max:255',
            'content'    => 'required|string',
            'summary'    => 'required|string',
            'decisions'  => 'required|string',
            'actions'    => 'required|string',
            'status'     => 'required|in:en attente,approuvé,rejeté',
            'file'       => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('file')) {
            // Supprimer l'ancien fichier
            if ($minute->file_path && Storage::disk('public')->exists($minute->file_path)) {
                Storage::disk('public')->delete($minute->file_path);
            }

            $minute->file_path = $request->file('file')->store('meeting_minutes', 'public');
        }

        $minute->update([
            'meeting_id' => $request->meeting_id,
            'title'      => $request->title,
            'content'    => $request->content,
            'summary'    => $request->summary,
            'decisions'  => $request->decisions,
            'actions'    => $request->actions,
            'status'     => $request->status,
        ]);

        return response()->json(['message' => 'Procès-verbal mis à jour avec succès', 'data' => $minute]);
    }

    // 🟢 Supprimer un procès-verbal
    public function destroy($id)
    {
        $minute = MeetingMinute::findOrFail($id);

        // Supprimer le fichier associé s’il existe
        if ($minute->file_path && Storage::disk('public')->exists($minute->file_path)) {
            Storage::disk('public')->delete($minute->file_path);
        }

        $minute->delete();

        return response()->json(['message' => 'Procès-verbal supprimé avec succès']);
    }

    // 🔵 Afficher un seul procès-verbal
    public function show($id)
    {
        $minute = MeetingMinute::with('meeting')->findOrFail($id);
        return response()->json($minute);
    }

    // 🔵 Endpoint pour valider un procès-verbal (pour les commission_manager)
    public function validate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approuvé,rejeté',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $minute = MeetingMinute::findOrFail($id);

        // Get current user
        $user = auth()->user();

        $minute->update([
            'status' => $request->status,
            'validated_by' => $user->id,
            'validated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Statut du procès-verbal mis à jour avec succès',
            'data' => $minute
        ]);
    }

    // 🔵 Récupérer les procès-verbaux par réunion
    public function getByMeeting($meetingId)
    {
        $minutes = MeetingMinute::with('meeting')
                    ->where('meeting_id', $meetingId)
                    ->get();

        return response()->json($minutes);
    }
}
