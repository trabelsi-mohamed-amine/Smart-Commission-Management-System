<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Impression du Rapport</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 14px;
        }

        h2 {
            text-align: center;
        }

        .section {
            margin-bottom: 20px;
        }

        .label {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .content {
            white-space: pre-line;
        }

        .footer {
            margin-top: 40px;
            text-align: right;
            font-size: 12px;
        }

        @media print {
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <h2>{{ $report->title }}</h2>

    <div class="section">
        <div class="label">Auteur :</div>
        <div class="content">{{ $report->author }}</div>
    </div>

    <div class="section">
        <div class="label">Résumé :</div>
        <div class="content">{{ $report->summary }}</div>
    </div>

    <div class="section">
        <div class="label">Décisions :</div>
        <div class="content">{{ $report->decisions }}</div>
    </div>

    <div class="section">
        <div class="label">Actions :</div>
        <div class="content">{{ $report->actions }}</div>
    </div>

    <div class="section">
        <div class="label">Responsable :</div>
        <div class="content">{{ $report->responsible }}</div>
    </div>

    <div class="section">
        <div class="label">Date limite :</div>
        <div class="content">{{ \Carbon\Carbon::parse($report->deadline)->format('d/m/Y') }}</div>
    </div>

    <div class="footer">
        Imprimé le {{ now()->format('d/m/Y H:i') }}
    </div>

    <div class="no-print" style="margin-top: 20px;">
        <button onclick="window.print()">Imprimer</button>
        <a href="{{ route('reports.index') }}">Retour</a>
    </div>
</body>
</html>
