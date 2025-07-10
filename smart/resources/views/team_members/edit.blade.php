@extends('layouts.app')

@section('title', 'Modifier un Membre')

@section('content')
    <div class="mb-4">
        <h2>Modifier le Membre</h2>
    </div>

    <form action="{{ route('team-members.update', $teamMember->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')  <!-- Cette ligne permet d'utiliser la méthode PUT pour la mise à jour -->

        <div class="mb-3">
            <label for="name" class="form-label">Nom</label>
            <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name', $teamMember->name) }}" required>
            @error('name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="role" class="form-label">Rôle</label>
            <input type="text" class="form-control @error('role') is-invalid @enderror" id="role" name="role" value="{{ old('role', $teamMember->role) }}" required>
            @error('role')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="img" class="form-label">Image</label>
            <input type="file" class="form-control @error('img') is-invalid @enderror" id="img" name="img">
            @error('img')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
            @if($teamMember->img)
                <div class="mt-2">
                    <img src="{{ asset('storage/' . $teamMember->img) }}" alt="Image actuelle" class="img-fluid" width="150">
                </div>
            @endif
        </div>

        <button type="submit" class="btn btn-success">Enregistrer</button>
    </form>

    <a href="{{ route('team-members.index') }}" class="btn btn-secondary mt-3">Retour à la liste</a>
@endsection
