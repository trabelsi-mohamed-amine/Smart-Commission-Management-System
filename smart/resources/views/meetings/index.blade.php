@extends('layouts.app')

@section('content')
    <h1>Liste des réunions</h1>

    <table class="table">
        <thead>
            <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Commission</th>
                <th>Date et Heure</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($meetings as $meeting)
                <tr>
                    <td>{{ $meeting->title }}</td>
                    <td>{{ $meeting->description }}</td>
                    <td>{{ $meeting->commission->name }}</td>
                    <td>{{ $meeting->date_time }}</td>
                    <td>
                        <!-- Actions: Modifier, Supprimer, etc. -->
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
