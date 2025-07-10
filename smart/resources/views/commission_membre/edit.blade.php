<!-- resources/views/commission_membre/edit.blade.php -->

@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Modifier l'association Membre - Commission</h1>
    
    <!-- Formulaire pour modifier l'association membre-commission -->
    <form action="{{ route('commission_membre.update', $commissionMembre->id) }}" method="POST">
        @csrf
        @method('PUT')
        
        <div class="form-group">
            <label for="commission_id">Commission</label>
            <select class="form-control" id="commission_id" name="commission_id" required>
                <option value="">Sélectionnez une Commission</option>
                @foreach($commissions as $commission)
                    <option value="{{ $commission->id }}" {{ $commissionMembre->commission_id == $commission->id ? 'selected' : '' }}>
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
                    <option value="{{ $membre->id }}" {{ $commissionMembre->membre_id == $membre->id ? 'selected' : '' }}>
                        {{ $membre->name }}
                    </option>
                @endforeach
            </select>
            @error('membre_id')
                <div class="text-danger">{{ $message }}</div>
            @enderror
        </div>

        <button type="submit" class="btn btn-primary mt-3">Mettre à jour l'Association</button>
    </form>
</div>
@endsection
