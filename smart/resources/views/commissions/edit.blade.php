<!-- resources/views/commissions/edit.blade.php -->

@extends('layouts.app')

@section('content')
    <h1>Éditer la Commission</h1>

    <form action="{{ route('commissions.update', $commission->id) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="name" class="form-label">Nom</label>
            <input type="text" class="form-control" id="name" name="name" value="{{ $commission->name }}" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" name="description">{{ $commission->description }}</textarea>
        </div>
        <button type="submit" class="btn btn-primary">Mettre à jour</button>
    </form>
@endsection
 edit