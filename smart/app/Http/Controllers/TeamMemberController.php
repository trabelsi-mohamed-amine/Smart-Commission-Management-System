<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class TeamMemberController extends Controller
{
    // Afficher tous les membres de l'équipe
    public function index()
    {
        $teamMembers = TeamMember::all();
        return view('team_members.index', compact('teamMembers'));
    }

    // Afficher le formulaire de création
    public function create()
    {
        return view('team_members.create');
    }

    // Enregistrer un nouveau membre
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'img' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',  // Validation de l'image
        ]);
    
        // Gestion de l'image
        if ($request->hasFile('img') && $request->file('img')->isValid()) {
            // Enregistrer l'image dans le dossier "team-images" de storage/app/public
            $path = $request->file('img')->store('team-images', 'public');  // Le deuxième paramètre spécifie le disque (public)
        }
    
        // Créer un nouveau membre d'équipe
        $teamMember = new TeamMember();
        $teamMember->name = $request->name;
        $teamMember->role = $request->role;
        $teamMember->img = $path;  // Enregistre le chemin de l'image dans la base de données
        $teamMember->save();
    
        return redirect()->route('team-members.index')->with('success', 'Membre ajouté avec succès');
    }

    // Afficher le formulaire d'édition
    public function edit($id)
    {
        $teamMember = TeamMember::findOrFail($id);
        return view('team_members.edit', compact('teamMember'));
    }

    // Mettre à jour un membre existant
    public function update(Request $request, $id)
{
    // Validation des données
    $request->validate([
        'name' => 'required|string|max:255',
        'role' => 'required|string|max:255',
        'img' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',  // Si l'image n'est pas obligatoire
    ]);

    // Trouver le membre à mettre à jour
    $teamMember = TeamMember::findOrFail($id);

    // Mettre à jour les informations
    $teamMember->name = $request->name;
    $teamMember->role = $request->role;

    // Vérifier si une nouvelle image est envoyée
    if ($request->hasFile('img') && $request->file('img')->isValid()) {
        // Enregistrer l'image dans le dossier public et obtenir son chemin
        $path = $request->file('img')->store('team-images', 'public');
        $teamMember->img = $path;  // Mettre à jour le chemin de l'image
    }

    // Sauvegarder les modifications dans la base de données
    $teamMember->save();

    return redirect()->route('team-members.index')->with('success', 'Membre mis à jour avec succès');
}

    // Supprimer un membre
    public function destroy($id)
{
    // Trouver le membre à supprimer
    $teamMember = TeamMember::findOrFail($id);

    // Supprimer l'image s'il y en a une
    if ($teamMember->img) {
        Storage::disk('public')->delete($teamMember->img);  // Supprimer l'image du dossier public
    }

    // Supprimer le membre de la base de données
    $teamMember->delete();

    // Rediriger vers la liste des membres avec un message de succès
    return redirect()->route('team-members.index')->with('success', 'Membre supprimé avec succès');
}

}
