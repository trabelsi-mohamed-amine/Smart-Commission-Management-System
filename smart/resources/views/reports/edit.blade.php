<!-- resources/views/reports/edit.blade.php -->
@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Modifier le rapport</h2>

    <form action="{{ route('reports.update', $report->id) }}" method="POST">
        @csrf
        @method('PUT')
        @include('reports.form', ['report' => $report])
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
    </form>
</div>
@endsection
