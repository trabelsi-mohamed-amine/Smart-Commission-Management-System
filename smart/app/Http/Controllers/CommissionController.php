<?php

namespace App\Http\Controllers;

use App\Models\Commission;
use App\Models\User;
use App\Notifications\NewCommissionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommissionController extends Controller
{
    // Afficher la liste des commissions
    public function index()
    {
        $commissions = Commission::all();
        return view('commissions.index', compact('commissions'));
    }

    // Afficher le formulaire de création
    public function create()
    {
        return view('commissions.create');
    }    // Enregistrer une nouvelle commission
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $commission = Commission::create($validated);

        // Send notifications about the new commission
        $this->sendNewCommissionNotifications($commission);

        return redirect()->route('commissions.index')->with('success', 'Commission créée avec succès.');
    }

    // Afficher une seule commission
    public function show($id)
    {
        $commission = Commission::findOrFail($id);
        return view('commissions.show', compact('commission'));
    }

    // Afficher le formulaire d’édition
    public function edit($id)
    {
        $commission = Commission::findOrFail($id);
        return view('commissions.edit', compact('commission'));
    }

    // Mettre à jour une commission
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $commission = Commission::findOrFail($id);
        $commission->update($validated);

        return redirect()->route('commissions.index')->with('success', 'Commission mise à jour.');
    }

    // Supprimer une commission    public function destroy($id)
    {
        $commission = Commission::findOrFail($id);
        $commission->delete();

        return redirect()->route('commissions.index')->with('success', 'Commission supprimée.');
    }

    /**
     * Send notifications to administrators and commission managers about a new commission
     *
     * @param Commission $commission The newly created commission
     * @return void
     */
    private function sendNewCommissionNotifications(Commission $commission)
    {
        try {
            // Get all administrators and commission managers
            $users = User::whereIn('role', ['administrator', 'commission_manager'])->get();

            // Also notify the specific manager if one is assigned
            if ($commission->manager_id) {
                $manager = User::find($commission->manager_id);
                if ($manager && !$users->contains('id', $manager->id)) {
                    $users->push($manager);
                }
            }

            // Notify each applicable user
            foreach ($users as $user) {
                $user->notify(new NewCommissionNotification($commission));
            }

            // Log the notifications
            Log::info("New commission notifications sent", [
                'commission_id' => $commission->id,
                'commission_name' => $commission->name,
                'notification_count' => $users->count()
            ]);
        } catch (\Exception $e) {
            Log::error("Error sending commission notifications: " . $e->getMessage());
        }
    }
}
