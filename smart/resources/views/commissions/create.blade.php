<!-- resources/views/commissions/create.blade.php -->

@extends('layouts.app')

@section('content')
    <h1>Créer une Commission</h1>

    <form action="{{ route('commissions.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Nom</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" name="description"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Créer</button>
    </form>
@endsection
 create
