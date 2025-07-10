<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TeamController extends Controller
{
    // Affiche toutes les équipes
    public function index()
    {
        $teams = Team::all();
        return response()->json($teams);
    }

    // Affiche une équipe spécifique par son ID
    public function show($id)
    {
        $team = Team::find($id);

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        return response()->json($team);
    }

    // Crée une nouvelle équipe
    public function store(Request $request)
    {
        // Validation de la requête
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {
            $team = new Team();
            $team->name = $request->name;
            $team->role = $request->role;

            if ($request->hasFile('image')) {
                // Sauvegarde de l'image
                $team->image = $request->file('image')->store('images', 'public');
            }

            $team->save();

            return response()->json($team, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while saving the team', 'error' => $e->getMessage()], 500);
        }
    }

    // Met à jour une équipe existante
    public function update(Request $request, $id)
    {
        // Validation de la requête
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Trouver l'équipe
        $team = Team::find($id);

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        try {
            // Mise à jour des données
            $team->name = $request->name;
            $team->role = $request->role;

            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($team->image) {
                    Storage::delete('public/' . $team->image);
                }
                // Sauvegarde de la nouvelle image
                $team->image = $request->file('image')->store('images', 'public');
            }

            $team->save();

            return response()->json($team);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while updating the team', 'error' => $e->getMessage()], 500);
        }
    }

    // Supprime une équipe
    public function destroy($id)
    {
        // Trouver l'équipe
        $team = Team::find($id);

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        try {
            // Supprimer l'image si elle existe
            if ($team->image) {
                Storage::delete('public/' . $team->image);
            }

            $team->delete();

            return response()->json(['message' => 'Team deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while deleting the team', 'error' => $e->getMessage()], 500);
        }
    }
}