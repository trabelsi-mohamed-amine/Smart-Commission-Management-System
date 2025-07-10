<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    // Afficher tous les membres
    public function index()
    {
        return response()->json(TeamMember::all());
    }

    // Créer un membre
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'img' => 'required|string|max:255',
        ]);

        $teamMember = TeamMember::create([
            'name' => $request->name,
            'role' => $request->role,
            'img' => $request->img,
        ]);

        return response()->json($teamMember, 201);
    }

    // Afficher un membre par ID
    public function show($id)
    {
        $teamMember = TeamMember::findOrFail($id);
        return response()->json($teamMember);
    }

    // Mettre à jour un membre
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'string|max:255',
            'role' => 'string|max:255',
            'img' => 'string|max:255',
        ]);

        $teamMember = TeamMember::findOrFail($id);

        $teamMember->update([
            'name' => $request->name ?? $teamMember->name,
            'role' => $request->role ?? $teamMember->role,
            'img' => $request->img ?? $teamMember->img,
        ]);

        return response()->json($teamMember);
    }

    // Supprimer un membre
    public function destroy($id)
    {
        $teamMember = TeamMember::findOrFail($id);
        $teamMember->delete();

        return response()->json(null, 204);
    }
}
