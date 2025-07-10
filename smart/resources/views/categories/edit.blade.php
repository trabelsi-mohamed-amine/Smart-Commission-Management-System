@extends('layouts.app')

@section('title', 'Modifier la Catégorie')

@section('content')
    <div class="mb-4">
        <h2>Modifier la Catégorie</h2>
    </div>

    <form action="{{ route('categories.update', $category->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="title" class="form-label">Titre</label>
            <input type="text" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title', $category->title) }}" required>
            @error('title')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="img" class="form-label">Image</label>
            <input type="file" class="form-control @error('img') is-invalid @enderror" id="img" name="img">
            @error('img')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
            @if($category->img)
                <div class="mt-2">
                    <img src="{{ asset($category->img) }}" width="100" alt="Image actuelle">
                </div>
            @endif
        </div>

        <button type="submit" class="btn btn-primary">Sauvegarder</button>
    </form>

    <a href="{{ route('categories.index') }}" class="btn btn-secondary mt-3">Retour à la liste</a>
@endsection
