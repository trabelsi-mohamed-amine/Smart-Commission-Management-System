<?php
namespace App\Http\Controllers\Api;

use App\Models\Typology;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class TypologyController extends Controller
{    public function index()
    {
        return Typology::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
        ]);

        return Typology::create($data);
    }

    public function update(Request $request, Typology $typology)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
        ]);

        $typology->update($data);
        return $typology;
    }

    public function destroy(Typology $typology)
    {
        $typology->delete();
        return response()->noContent();
    }
}
