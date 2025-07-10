<!-- resources/views/commissions/index.blade.php -->

@extends('layouts.app')

@section('content')
    <h1>Liste des Commissions</h1>

    <a href="{{ route('commissions.create') }}" class="btn btn-primary mb-3">Créer une commission</a>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($commissions as $commission)
                <tr>
                    <td>{{ $commission->name }}</td>
                    <td>{{ $commission->description }}</td>
                    <td>
                        <a href="{{ route('commissions.show', $commission->id) }}" class="btn btn-info btn-sm">Voir</a>
                        <a href="{{ route('commissions.edit', $commission->id) }}" class="btn btn-warning btn-sm">Éditer</a>
                        <form action="{{ route('commissions.destroy', $commission->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Supprimer</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
index