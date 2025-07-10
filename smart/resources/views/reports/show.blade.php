@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <h2 class="mb-4">{{ $report->title }}</h2>

    <div class="mb-3">
        <strong>Auteur :</strong> {{ $report->author }}
    </div>

    <div class="mb-3">
        <strong>Résumé :</strong>
        <p>{{ $report->summary }}</p>
    </div>

    <div class="mb-3">
        <strong>Décisions :</strong>
        <p>{{ $report->decisions }}</p>
    </div>

    <div class="mb-3">
        <strong>Actions :</strong>
        <p>{{ $report->actions }}</p>
    </div>

    <div class="mb-3">
        <strong>Responsable :</strong> {{ $report->responsible }}
    </div>

    <div class="mb-3">
        <strong>Date limite :</strong> {{ \Carbon\Carbon::parse($report->deadline)->format('d/m/Y') }}
    </div>

    <a href="{{ route('reports.index') }}" class="btn btn-secondary">Retour à la liste</a>
</div>
@endsection
