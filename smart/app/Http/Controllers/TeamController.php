<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TeamController extends Controller
{
    // Afficher tous les membres de l'équipe
    public function index()
    {
        $teamMembers = Team::all()->map(function($member) {
            // Ajoutez l'URL complète de l'image à chaque membre
            $member->image_url = $member->image ? asset("storage/{$member->image}") : null;
            return $member;
        });
        
        return response()->json($teamMembers);
    }
    // Afficher un membre spécifique de l'équipe
    public function show($id)
    {
        $teamMember = Team::findOrFail($id);
        return response()->json($teamMember);
    }

    // Ajouter un nouveau membre
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'role' => 'required|string|max:255',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
    ]);

    $teamMember = new Team();
    $teamMember->name = $request->name;
    $teamMember->role = $request->role;

    if ($request->hasFile('image') && $request->file('image')->isValid()) {
        $path = $request->file('image')->store('team-images', 'public');
        $teamMember->image = $path; // Ceci stocke le chemin relatif (ex: "team-images/filename.jpg")
    }

    $teamMember->save();

    // Retournez l'URL complète de l'image
    $response = $teamMember->toArray();
    $response['image_url'] = $teamMember->image ? asset("storage/{$teamMember->image}") : null;

    return response()->json($response, 201);
}

    // Mettre à jour un membre de l'équipe
    public function update(Request $request, $id)
    {
        $teamMember = Team::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $teamMember->name = $request->name;
        $teamMember->role = $request->role;

        // Mettre à jour l'image si un fichier est envoyé
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Supprimer l'ancienne image si elle existe
            if ($teamMember->image) {
                Storage::disk('public')->delete($teamMember->image);
            }
            $path = $request->file('image')->store('team-images', 'public');
            $teamMember->image = $path;
        }

        $teamMember->save();

        return response()->json($teamMember);
    }

    // Supprimer un membre de l'équipe
    public function destroy($id)
    {
        $teamMember = Team::findOrFail($id);

        // Supprimer l'image associée si elle existe
        if ($teamMember->image) {
            Storage::disk('public')->delete($teamMember->image);
        }

        $teamMember->delete();

        return response()->json(['message' => 'Membre supprimé avec succès']);
    }
}