<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // Afficher tous les services
    public function index()
    {
        return response()->json(Service::all());
    }

    // Créer un service
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|string|max:7',
        ]);

        $service = Service::create([
            'title' => $request->title,
            'description' => $request->description,
            'color' => $request->color,
        ]);

        return response()->json($service, 201);
    }

    // Afficher un service par ID
    public function show($id)
    {
        $service = Service::findOrFail($id);
        return response()->json($service);
    }

    // Mettre à jour un service
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'color' => 'string|max:7',
        ]);

        $service = Service::findOrFail($id);
        $service->update([
            'title' => $request->title ?? $service->title,
            'description' => $request->description ?? $service->description,
            'color' => $request->color ?? $service->color,
        ]);

        return response()->json($service);
    }

    // Supprimer un service
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json(null, 204);
    }
}
