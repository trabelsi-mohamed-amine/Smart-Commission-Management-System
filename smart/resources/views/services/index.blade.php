@extends('layouts.app')

@section('title', 'Liste des Services')

@section('content')
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Services</h2>
        <a href="{{ route('services.create') }}" class="btn btn-primary">Ajouter un Service</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($services as $service)
                <tr>
                    <td>{{ $service->id }}</td>
                    <td>{{ $service->title }}</td>
                    <td>{{ $service->description }}</td>
                    <td><img src="{{ asset($service->img) }}" width="100" alt="{{ $service->title }}"></td>
                    <td class="d-flex gap-2">
                        <a href="{{ route('services.edit', $service->id) }}" class="btn btn-warning btn-sm">Modifier</a>
                        <form action="{{ route('services.destroy', $service->id) }}" method="POST" onsubmit="return confirm('Supprimer ce service ?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">Aucun service disponible.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
@endsection
