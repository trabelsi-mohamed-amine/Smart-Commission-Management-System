@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Membres de la commission {{ $commission->nom }}</h1>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <form action="{{ route('commission_membre.store', $commission->id) }}" method="POST">
        @csrf
        <div class="form-group">
            <label for="membre_id">Ajouter un membre</label>
            <select name="membre_id" id="membre_id" class="form-control" required>
                <option value="">Sélectionner un membre</option>
                @foreach($membres as $membre)
                    <option value="{{ $membre->id }}">{{ $membre->nom }}</option>
                @endforeach
            </select>
        </div>
        <button type="submit" class="btn btn-primary mt-3">Ajouter</button>
    </form>

    <h2 class="mt-5">Membres déjà associés</h2>
    <ul class="list-group">
        @foreach($membres as $membre)
            <li class="list-group-item">
                {{ $membre->nom }}
                <form action="{{ route('commission_membre.destroy', [$commission->id, $membre->id]) }}" method="POST" style="display: inline;">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger btn-sm float-right">Supprimer</button>
                </form>
            </li>
        @endforeach
    </ul>
</div>
@endsection
