@extends('layouts.app')

@section('title', 'Liste des Membres de l\'équipe')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Membres de l'équipe</h2>
        <a href="{{ route('team-members.create') }}" class="btn btn-primary">Ajouter un Membre</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($teamMembers as $member)
                <tr>
                    <td>{{ $member->id }}</td>
                    <td>{{ $member->name }}</td>
                    <td>{{ $member->role }}</td>
                    <td><img src="{{ asset('storage/' . $member->img) }}" width="100" alt="{{ $member->name }}"/>
                    </td>
                    <td class="d-flex gap-2">
                        <a href="{{ route('team-members.edit', $member->id) }}" class="btn btn-warning btn-sm">Modifier</a>
                        <form action="{{ route('team-members.destroy', $member->id) }}" method="POST" onsubmit="return confirm('Supprimer ce membre ?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">Aucun membre disponible.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection
