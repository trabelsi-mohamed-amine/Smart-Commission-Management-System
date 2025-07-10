<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Récupérer toutes les catégories
    public function index()
    {
        return response()->json(Category::all(), 200);
    }

    // Créer une nouvelle catégorie
    public function store(Request $request)
    {
        // Validation des données envoyées
        $request->validate([
            'title' => 'required|string|max:255',
            'img' => 'required|string|max:255',
        ]);

        // Créer une nouvelle catégorie et retourner la réponse
        $category = Category::create([
            'title' => $request->title,
            'img' => $request->img,
        ]);

        return response()->json($category, 201);
    }

    // Récupérer une catégorie par son ID
    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json($category, 200);
    }

    // Mettre à jour une catégorie
    public function update(Request $request, $id)
    {
        // Validation des données
        $request->validate([
            'title' => 'nullable|string|max:255',
            'img' => 'nullable|string|max:255',
        ]);

        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Mise à jour des champs uniquement s'ils sont fournis
        $category->update([
            'title' => $request->title ?? $category->title,
            'img' => $request->img ?? $category->img,
        ]);

        return response()->json($category, 200);
    }

    // Supprimer une catégorie
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
