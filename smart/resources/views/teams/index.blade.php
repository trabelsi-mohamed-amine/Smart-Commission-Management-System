@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <h2 class="text-2xl font-bold mb-4">Liste des membres de l'équipe</h2>
    <a href="{{ route('teams.create') }}" class="btn btn-primary mb-4">Ajouter un membre</a>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @foreach($teams as $team)
        <div class="border p-4 rounded shadow">
            @if($team->image)
            <img src="{{ asset('storage/' . $team->image) }}" alt="{{ $team->nom }}" class="w-full h-48 object-cover mb-2">
            @endif
            <h3 class="text-xl font-semibold">{{ $team->nom }}</h3>
            <p class="text-gray-600">{{ $team->role }}</p>
            <div class="mt-2 space-x-2">
                <a href="{{ route('teams.edit', $team->id) }}" class="btn btn-warning">Modifier</a>
                <form action="{{ route('teams.destroy', $team->id) }}" method="POST" class="inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">Supprimer</button>
                </form>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection
