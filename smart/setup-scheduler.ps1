# PowerShell script to set up Laravel scheduler in Windows Task Scheduler
# Run as Administrator

# Get current directory
$currentPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$batchFilePath = Join-Path $currentPath "run_scheduler.bat"
$logFilePath = Join-Path $currentPath "storage\logs\scheduler.log"

# Create the batch file
$batchContent = @"
@echo off
cd /d "$currentPath"
php artisan schedule:run >> "$logFilePath" 2>&1
"@

Set-Content -Path $batchFilePath -Value $batchContent -Force

Write-Host "Created batch file at $batchFilePath"

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "This script requires administrative privileges to create the scheduled task."
    Write-Host "Please run PowerShell as Administrator and try again."
    exit
}

# Create scheduled task
$taskName = "Laravel Scheduler - Smart Commission"
$taskExists = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($taskExists) {
    Write-Host "Task '$taskName' already exists. Removing old task..."
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

$action = New-ScheduledTaskAction -Execute $batchFilePath
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration ([TimeSpan]::MaxValue)
$settings = New-ScheduledTaskSettingsSet -DontStopOnIdleEnd -RestartInterval (New-TimeSpan -Minutes 1) -RestartCount 3 -StartWhenAvailable

Write-Host "Creating scheduled task..."
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Runs Laravel scheduler every minute" -Force

Write-Host "Task created successfully!"
Write-Host "The Laravel scheduler will now run every minute."
