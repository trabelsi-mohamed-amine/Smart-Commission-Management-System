<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use Illuminate\Support\Facades\Validator;

class ModulesController extends Controller
{
    // Lister tous les modules
    public function index()
    {
        return response()->json(Module::all());
    }

    // Créer un nouveau module
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'icon' => 'nullable|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module = Module::create($request->all());
        return response()->json($module, 201);
    }

    // Mettre à jour un module
    public function update(Request $request, $id)
    {
        $module = Module::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'icon' => 'nullable|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module->update($request->all());
        return response()->json($module);
    }

    // Supprimer un module
    public function destroy($id)
    {
        $module = Module::findOrFail($id);
        $module->delete();

        return response()->json(['message' => 'Module supprimé.']);
    }
}
