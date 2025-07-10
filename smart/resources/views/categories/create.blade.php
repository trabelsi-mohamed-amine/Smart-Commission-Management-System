@extends('layouts.app')

@section('title', 'Ajouter une Catégorie')

@section('content')
    <div class="mb-4">
        <h2>Ajouter une Catégorie</h2>
    </div>

    <form action="{{ route('categories.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label for="title" class="form-label">Titre</label>
            <input type="text" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title') }}" required>
            @error('title')
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

        <button type="submit" class="btn btn-primary">Ajouter</button>
    </form>

    <a href="{{ route('categories.index') }}" class="btn btn-secondary mt-3">Retour à la liste</a>
@endsection
