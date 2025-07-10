<?php

namespace App\Http\Controllers;

use App\Models\MeetingMinute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MeetingMinuteController extends Controller
{
    public function index()
    {
        return MeetingMinute::with('meeting')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'meeting_id' => 'required|exists:meetings,id',
            'summary' => 'required|string',
            'decisions' => 'required|string',
            'actions' => 'required|string',
            'status' => 'required|in:en attente,approuvé,rejeté',
            'file' => 'nullable|file|mimes:pdf,docx,xlsx|max:10240',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('meeting_minutes_files');
        }

        $minute = MeetingMinute::create([
            'meeting_id' => $request->meeting_id,
            'summary' => $request->summary,
            'decisions' => $request->decisions,
            'actions' => $request->actions,
            'status' => $request->status,
            'file_path' => $filePath,
        ]);

        return response()->json($minute, 201);
    }

    public function update(Request $request, $id)
    {
        $minute = MeetingMinute::findOrFail($id);

        $request->validate([
            'summary' => 'required|string',
            'decisions' => 'required|string',
            'actions' => 'required|string',
            'status' => 'required|in:en attente,approuvé,rejeté',
            'file' => 'nullable|file|mimes:pdf,docx,xlsx|max:10240',
        ]);

        if ($request->hasFile('file')) {
            if ($minute->file_path) {
                Storage::delete($minute->file_path);
            }
            $minute->file_path = $request->file('file')->store('meeting_minutes_files');
        }

        $minute->update([
            'summary' => $request->summary,
            'decisions' => $request->decisions,
            'actions' => $request->actions,
            'status' => $request->status,
            'file_path' => $minute->file_path,
        ]);

        return response()->json($minute);
    }

    public function destroy($id)
    {
        $minute = MeetingMinute::findOrFail($id);
        if ($minute->file_path) {
            Storage::delete($minute->file_path);
        }
        $minute->delete();

        return response()->json(['message' => 'Supprimé avec succès.']);
    }
}
