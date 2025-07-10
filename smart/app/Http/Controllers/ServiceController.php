<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return view('services.index', compact('services'));
    }

    public function create()
    {
        return view('services.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'color' => 'required|string|max:7',
            'icon' => 'required|string',
        ]);

        Service::create([
            'title' => $request->title,
            'description' => $request->description,
            'color' => $request->color,
            'icon' => $request->icon,
        ]);

        return redirect()->route('services.index')->with('success', 'Service créé avec succès');
    }

    public function edit($id)
    {
        $service = Service::findOrFail($id);
        return view('services.edit', compact('service'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'color' => 'string|max:7',
            'icon' => 'string',
        ]);

        $service = Service::findOrFail($id);
        $service->update([
            'title' => $request->title ?? $service->title,
            'description' => $request->description ?? $service->description,
            'color' => $request->color ?? $service->color,
            'icon' => $request->icon ?? $service->icon,
        ]);

        return redirect()->route('services.index')->with('success', 'Service mis à jour avec succès');
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return redirect()->route('services.index')->with('success', 'Service supprimé avec succès');
    }
}
