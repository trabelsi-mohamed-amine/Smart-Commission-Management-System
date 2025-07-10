$migrations = @(
    "create_users_table",
    "create_password_reset_tokens_table",
    "create_cache_table",
    "create_cache_locks_table",
    "create_sessions_table",
    "create_personal_access_tokens_table",
    "create_failed_jobs_table",
    "create_jobs_table",
    "create_job_batches_table",
    "create_commissions_table",
    "create_meetings_table",
    "create_meeting_participants_table",
    "create_meeting_transcripts_table",
    "create_categories_table",
    "create_contacts_table",
    "create_modules_table",
    "create_services_table",
    "create_team_members_table",
    "create_typologies_table"
)

$baseDate = "2025_05_19"
$startTime = "000000"

# Create the migrations directory if it doesn't exist
$migrationsDir = "database\migrations"
if (-not (Test-Path $migrationsDir)) {
    New-Item -ItemType Directory -Path $migrationsDir
}

# Loop through each migration and rename
for ($i = 0; $i -lt $migrations.Length; $i++) {
    $timeInt = [int]$startTime + $i
    $timeStr = $timeInt.ToString("000000")
    $newName = "${baseDate}_${timeStr}_$($migrations[$i]).php"

    # Find existing migration file
    $existingFile = Get-ChildItem -Path $migrationsDir -Filter "*_$($migrations[$i]).php"
    if ($existingFile) {
        Move-Item -Path $existingFile.FullName -Destination (Join-Path $migrationsDir $newName) -Force
    }
}
