<div class="mb-3">
    <label>Titre</label>
    <input type="text" name="title" class="form-control" value="{{ old('title', $report->title ?? '') }}" required>
</div>

<div class="mb-3">
    <label>Résumé</label>
    <textarea name="summary" class="form-control" required>{{ old('summary', $report->summary ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label>Décisions</label>
    <textarea name="decisions" class="form-control" required>{{ old('decisions', $report->decisions ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label>Actions</label>
    <textarea name="actions" class="form-control" required>{{ old('actions', $report->actions ?? '') }}</textarea>
</div>

<div class="mb-3">
    <label>Responsable</label>
    <input type="text" name="responsible" class="form-control" value="{{ old('responsible', $report->responsible ?? '') }}" required>
</div>

<div class="mb-3">
    <label>Date limite</label>
    <input type="date" name="deadline" class="form-control"
    value="{{ old('deadline', isset($report) ? \Carbon\Carbon::parse($report->deadline)->format('Y-m-d') : '') }}"
    required>
</div>
