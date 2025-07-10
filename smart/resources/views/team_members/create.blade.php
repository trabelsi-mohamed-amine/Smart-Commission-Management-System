@extends('layouts.app')

@section('title', 'Ajouter un Membre')

@section('content')
    <div class="mb-4">
        <h2>Créer un Nouveau Membre</h2>
    </div>

    <form action="{{ route('team-members.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label for="name" class="form-label">Nom</label>
            <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" value="{{ old('name') }}" required>
            @error('name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="role" class="form-label">Rôle</label>
            <input type="text" class="form-control @error('role') is-invalid @enderror" id="role" name="role" value="{{ old('role') }}" required>
            @error('role')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="img" class="form-label">Image</label>
            <input type="file" class="form-control @error('img') is-invalid @enderror" id="img" name="img" required>
            @error('img')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <button type="submit" class="btn btn-success">Enregistrer</button>
    </form>

    <a href="{{ route('team-members.index') }}" class="btn btn-secondary mt-3">Retour à la liste</a>
@endsection
