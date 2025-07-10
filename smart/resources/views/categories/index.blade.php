@extends('layouts.app')

@section('title', 'Liste des Catégories')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Catégories</h2>
        <a href="{{ route('categories.create') }}" class="btn btn-primary">Ajouter une Catégorie</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($categories as $cat)
                <tr>
                    <td>{{ $cat->id }}</td>
                    <td>{{ $cat->title }}</td>
                    <td><img src="{{ asset($cat->img) }}" width="100"></td>
                    <td class="d-flex gap-2">
                        <a href="{{ route('categories.edit', $cat->id) }}" class="btn btn-warning btn-sm">Modifier</a>
                        <form action="{{ route('categories.destroy', $cat->id) }}" method="POST" onsubmit="return confirm('Supprimer cette catégorie ?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" class="text-center">Aucune catégorie disponible.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection
