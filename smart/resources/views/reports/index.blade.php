<!-- resources/views/reports/index.blade.php -->

@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Liste des Rapports</h2>

    <!-- Bouton pour ajouter un rapport -->
    <a href="{{ route('reports.create') }}" class="btn btn-success mb-3">Ajouter un rapport</a>

  
    @foreach ($reports as $report)
        <div class="card mb-3">
            <div class="card-body">
                <h5>{{ $report->title }}</h5>
                <p><strong>Responsable :</strong> {{ $report->responsible }}</p>
                <p><strong>Date limite :</strong> {{ $report->deadline }}</p>
                <a href="{{ route('reports.show', $report->id) }}" class="btn btn-info">Voir</a>
                <a href="{{ route('reports.edit', $report->id) }}" class="btn btn-warning">Modifier</a>
                <a href="{{ route('reports.print', $report->id) }}" class="btn btn-secondary" target="_blank">Imprimer</a>

                <!-- Formulaire pour supprimer un rapport -->
                <form action="{{ route('reports.destroy', $report->id) }}" method="POST" style="display:inline-block;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger" onclick="return confirm('Confirmer la suppression ?')">Supprimer</button>
                </form>
            </div>
        </div>
    @endforeach
</div>
@endsection
