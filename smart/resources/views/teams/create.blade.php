@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <h2 class="text-2xl font-bold mb-4">Ajouter un membre à l'équipe</h2>
    
    <form action="{{ route('teams.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-4">
            <label for="nom" class="block text-sm font-semibold">Nom</label>
            <input type="text" name="nom" id="nom" class="form-input mt-1 block w-full" required>
        </div>

        <div class="mb-4">
            <label for="role" class="block text-sm font-semibold">Rôle</label>
            <input type="text" name="role" id="role" class="form-inpaut mt-1 block w-full" required>
        </div>

        <div class="mb-4">
            <label for="image" class="block text-sm font-semibold">Image</label>
            <input type="file" name="image" id="image" class="form-input mt-1 block w-full">
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Ajouter</button>
    </form>
</div>
@endsection
