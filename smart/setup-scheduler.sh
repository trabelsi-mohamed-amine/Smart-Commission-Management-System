#!/bin/bash
# Script to set up Laravel scheduler in crontab

# Get the absolute path of the project directory
PROJECT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# Create the crontab entry
CRON_JOB="* * * * * cd $PROJECT_DIR && php artisan schedule:run >> /dev/null 2>&1"

# Check if the crontab entry already exists
if crontab -l | grep -q "$PROJECT_DIR.*schedule:run"; then
    echo "The Laravel scheduler is already in your crontab."
else
    # Add the crontab entry
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "Added Laravel scheduler to crontab. It will run every minute."
fi

echo "To verify, run: crontab -l"
echo "To test the scheduler manually, run: php artisan schedule:run"
