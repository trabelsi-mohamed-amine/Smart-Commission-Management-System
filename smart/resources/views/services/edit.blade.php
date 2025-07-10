@extends('layouts.app')

@section('title', 'Modifier le Service')

@section('content')
    <div class="mb-4">
        <h2>Modifier le Service</h2>
    </div>

    <form action="{{ route('services.update', $service->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="title" class="form-label">Titre</label>
            <input type="text" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title', $service->title) }}" required>
            @error('title')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <input type="text" class="form-control @error('description') is-invalid @enderror" id="description" name="description" value="{{ old('description', $service->description) }}" required>
            @error('description')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="color" class="form-label">Couleur</label>
            <input type="text" class="form-control @error('color') is-invalid @enderror" id="color" name="color" value="{{ old('color', $service->color) }}" required>
            @error('color')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="img" class="form-label">Image</label>
            <input type="file" class="form-control @error('img') is-invalid @enderror" id="img" name="img">
            @error('img')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
            @if($service->img)
                <div class="mt-2">
                    <img src="{{ asset($service->img) }}" width="100" alt="Image actuelle">
                </div>
            @endif
        </div>

        <button type="submit" class="btn btn-primary">Mettre à jour</button>
    </form>

    <a href="{{ route('services.index') }}" class="btn btn-secondary mt-3">Retour à la liste</a>
@endsection
