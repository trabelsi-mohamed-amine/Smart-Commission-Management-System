@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Créer un nouveau rapport</h2>
    <form action="{{ route('reports.store') }}" method="POST">
    @csrf
    <input type="text" name="title" required>
    <input type="text" name="summary" required>
    <textarea name="decisions" required></textarea>
    <textarea name="actions" required></textarea>
    <input type="text" name="responsible" required>
    <input type="date" name="deadline" required>
    <button type="submit">Créer</button>
</form>

</div>
@endsection
