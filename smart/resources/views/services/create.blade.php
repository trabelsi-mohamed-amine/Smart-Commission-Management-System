@extends('layouts.app')

@section('title', 'Ajouter un Service')

@section('content')
    <div class="mb-4">
        <h2>Créer un Service</h2>
    </div>

    <form action="{{ route('services.store') }}" method="POST">
        @csrf

        <div class="mb-3">
            <label for="title" class="form-label">Titre</label>
            <input type="text" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title') }}" required>
            @error('title')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <input type="text" class="form-control @error('description') is-invalid @enderror" id="description" name="description" value="{{ old('description') }}" required>
            @error('description')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="color" class="form-label">Couleur</label>
            <input type="text" class="form-control @error('color') is-invalid @enderror" id="color" name="color" value="{{ old('color') }}" required>
            @error('color')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="icon" class="form-label">Icône</label>
            <input type="text" class="form-control @error('icon') is-invalid @enderror" id="icon" name="icon" value="{{ old('icon') }}" required>
            @error('icon')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <button type="submit" class="btn btn-primary">Enregistrer</button>
    </form>

    <a href="{{ route('services.index') }}" class="btn btn-secondary mt-3">Retour à la liste</a>
@endsection
