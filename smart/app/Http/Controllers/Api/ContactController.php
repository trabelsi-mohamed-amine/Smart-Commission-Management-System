<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->paginate(10);
        return response()->json($contacts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $contact
        ], 201);
    }

    public function show(Contact $contact)
    {
        $contact->update(['read' => true]);
        return response()->json($contact);
    }

    public function markAsRead(Contact $contact)
    {
        $contact->update(['read' => true]);
        return response()->json(['success' => true]);
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['success' => true]);
    }
}
