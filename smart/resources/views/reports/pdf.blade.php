<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport PDF</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #000;
            margin: 40px;
        }
        h1, h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 30px;
        }
        .label {
            font-weight: bold;
        }
        .content-box {
            border: 1px solid #333;
            padding: 15px;
            background-color: #f9f9f9;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <h1>Rapport Officiel</h1>
    <h2>{{ $report->title ?? 'Titre non défini' }}</h2>

    <div class="section">
        <p><span class="label">Date :</span> {{ $report->created_at->format('d/m/Y') }}</p>
        <p><span class="label">Auteur :</span> {{ $report->author ?? 'Inconnu' }}</p>
    </div>

    <div class="section">
        <p class="label">Contenu :</p>
        <div class="content-box">
            {!! nl2br(e($report->content ?? 'Aucun contenu.')) !!}
        </div>
    </div>

</body>
</html>
