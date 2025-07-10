@extends('layouts.app')

@section('content')
    <h1>Créer une réunion</h1>

    <!-- Formulaire de création de réunion -->
    <form action="{{ route('meetings.store') }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="title">Titre</label>
            <input type="text" name="title" id="title" class="form-control" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" id="description" class="form-control"></textarea>
        </div>

        <div class="form-group">
            <label for="commission_id">Commission</label>
            <select name="commission_id" id="commission_id" class="form-control" required>
                @foreach($commissions as $commission)
                    <option value="{{ $commission->id }}">{{ $commission->name }}</option> <!-- Remplacer 'name' par le champ que tu utilises -->
                @endforeach
            </select>
        </div>

        <div class="form-group">
            <label for="date_time">Date et Heure</label>
            <input type="datetime-local" name="date_time" id="date_time" class="form-control" required>
        </div>

        <button type="submit" class="btn btn-primary">Créer la réunion</button>
    </form>
@endsection
