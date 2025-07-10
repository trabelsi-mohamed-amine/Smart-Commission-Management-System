<!-- resources/views/commission_membre/create.blade.php -->

@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Associer un Membre à une Commission</h1>
    
    <!-- Formulaire pour associer un membre à une commission -->
    <form action="{{ route('commission_membre.store') }}" method="POST">
        @csrf
        
        <div class="form-group">
            <label for="commission_id">Commission</label>
            <select class="form-control" id="commission_id" name="commission_id" required>
                <option value="">Sélectionnez une Commission</option>
                @foreach($commissions as $commission)
                    <option value="{{ $commission->id }}" {{ old('commission_id') == $commission->id ? 'selected' : '' }}>
                        {{ $commission->name }}
                    </option>
                @endforeach
            </select>
            @error('commission_id')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>
        
        <div class="form-group">
            <label for="membre_id">Membre</label>
            <select class="form-control" id="membre_id" name="membre_id" required>
                <option value="">Sélectionnez un Membre</option>
                @foreach($membres as $membre)
                    <option value="{{ $membre->id }}" {{ old('membre_id') == $membre->id ? 'selected' : '' }}>
                        {{ $membre->name }}
                    </option>
                @endforeach
            </select>
            @error('membre_id')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>

        <button type="submit" class="btn btn-primary mt-3">Associer Membre</button>
    </form>
</div>
@endsection
