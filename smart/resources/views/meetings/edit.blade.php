@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Modifier la réunion</h1>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('meetings.update', $meeting->id) }}">
        @csrf
        @method('PUT')

        <div class="form-group">
            <label for="title">Titre</label>
            <input type="text" id="title" name="title" class="form-control" value="{{ old('title', $meeting->title) }}" required>
        </div>

        <div class="form-group">
            <label for="description">Description</label>
            <input type="text" id="description" name="description" class="form-control" value="{{ old('description', $meeting->description) }}">
        </div>

        <div class="form-group">
            <label for="meeting_date">Date</label>
            @php
                $meetingDate = \Carbon\Carbon::parse($meeting->meeting_date)->format('Y-m-d');
            @endphp
            <input type="date" id="meeting_date" name="meeting_date" class="form-control" 
                   value="{{ old('meeting_date', $meetingDate) }}" required>
        </div>

        <div class="form-group">
            <label for="location">Lieu</label>
            <input type="text" id="location" name="location" class="form-control" value="{{ old('location', $meeting->location) }}" required>
        </div>

        <div class="form-group">
            <label for="status">Statut</label>
            <select id="status" name="status" class="form-control" required>
                <option value="scheduled" {{ $meeting->status == 'scheduled' ? 'selected' : '' }}>Prévue</option>
                <option value="completed" {{ $meeting->status == 'completed' ? 'selected' : '' }}>Terminée</option>
                <option value="cancelled" {{ $meeting->status == 'cancelled' ? 'selected' : '' }}>Annulée</option>
            </select>
        </div>

        <button type="submit" class="btn btn-success mt-3">Mettre à jour</button>
    </form>
</div>
@endsection
 edit