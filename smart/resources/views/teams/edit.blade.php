@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <h2 class="text-2xl font-bold mb-4">Modifier le membre de l'équipe</h2>
    
    <form action="{{ route('teams.update', $team->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-4">
            <label for="nom" class="block text-sm font-semibold">Nom</label>
            <input type="text" name="nom" id="nom" class="form-input mt-1 block w-full" value="{{ $team->nom }}" required>
        </div>

        <div class="mb-4">
            <label for="role" class="block text-sm font-semibold">Rôle</label>
            <input type="text" name="role" id="role" class="form-input mt-1 block w-full" value="{{ $team->role }}" required>
        </div>

        <div class="mb-4">
            <label for="image" class="block text-sm font-semibold">Image</label>
            <input type="file" name="image" id="image" class="form-input mt-1 block w-full">
        </div>

        <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Modifier</button>
    </form>
</div>
@endsection
