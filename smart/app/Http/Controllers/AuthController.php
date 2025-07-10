<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|string|in:administrator,commission_member,commission_manager',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'commission_member' // Use provided role or default to commission_member
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    } catch (\Exception $e) {
        \Log::error('Registration error: ' . $e->getMessage());
        return response()->json([
            'message' => 'Registration failed',
            'error' => $e->getMessage()
        ], 500);
    }
}


    public function login(Request $request)
{
    try {
        // Log the request for debugging
        \Log::info('Login attempt', ['email' => $request->email]);

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            \Log::warning('Login validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the user exists
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            \Log::info('User not found', ['email' => $request->email]);
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Check if the password is correct
        if (!Hash::check($request->password, $user->password)) {
            \Log::info('Password incorrect', ['user' => $user->id]);
            return response()->json(['message' => 'Mot de passe incorrect'], 401);
        }

        // Create a token for the user
        try {
            $token = $user->createToken('SmartMeet')->plainTextToken;
            \Log::info('Login successful', ['user' => $user->id]);

            return response()->json([
                'message' => 'Connexion réussie',
                'user' => $user,
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Token creation error', ['user' => $user->id, 'error' => $e->getMessage()]);
            throw $e;
        }
    } catch (\Exception $e) {
        \Log::error('Login error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'request' => $request->all()
        ]);
        return response()->json([
            'message' => 'Login failed',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
