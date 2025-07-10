<!-- resources/views/commissions/show.blade.php -->

@extends('layouts.app')

@section('content')
    <h1>Détails de la Commission</h1>

    <p><strong>Nom:</strong> {{ $commission->name }}</p>
    <p><strong>Description:</strong> {{ $commission->description }}</p>

    <a href="{{ route('commissions.index') }}" class="btn btn-secondary">Retour à la liste</a>
@endsection
 show