# Meeting Notification System Guide

This guide explains how to use the new notification system for meetings in our application. The system has been designed to work without relying on the Laravel scheduler, making it more portable and easier to deploy.

## For End Users

### How You'll Receive Notifications

1. **On Login**: When you log in, the system will automatically check for any meetings scheduled for today and notify you.

2. **In the Dashboard**: The dashboard displays a count of today's meetings at the top.

3. **Browser Notifications**: While using the application, you may receive browser notifications for meetings scheduled today (requires permission).

4. **Notification Bell**: The notification bell in the top navigation bar shows all your notifications, including meeting reminders.

### Allowing Browser Notifications

For the best experience, allow browser notifications when prompted:

1. When you first access the dashboard, you'll see a prompt asking for notification permission
2. Click "Allow" to receive desktop notifications even when the app is in the background
3. If you denied notifications, you can enable them in your browser settings:
   - Chrome: Site Settings > Notifications
   - Firefox: Site Permissions > Notifications
   - Edge: Site Permissions > Notifications

## For Administrators

### How the System Works

The notification system uses a multi-layered approach:

1. **Login Check**: A middleware checks for today's meetings whenever a user logs in
2. **API Endpoint**: The frontend can fetch today's meetings through `/api/meetings/today`
3. **Client Polling**: A JavaScript service periodically checks for meetings

### Advantages Over the Previous System

- **No Scheduler Dependency**: Works without setting up cron jobs or Windows Task Scheduler
- **Cross-Platform**: Functions consistently across different hosting environments
- **Real-time Notifications**: Users get notifications as soon as they log in
- **Resource Efficient**: Only checks for meetings for active users

### Testing the System

You can test the notification system using the provided script:

```bash
php test_non_scheduler_notifications.php
```

### Troubleshooting

If notifications aren't being delivered:

1. Check that the middleware is registered in `app/Http/Kernel.php`
2. Verify that routes are properly registered in `routes/web.php`
3. Ensure the frontend JavaScript is loading correctly
4. Look for errors in the browser console
5. Check application logs in `storage/logs/laravel.log`

## Extending the System

To add additional notification types:

1. Create a new notification class in `app/Notifications`
2. Update the middleware to send your new notification type
3. Update the frontend notification service to handle the new type

For questions or issues with the notification system, please contact the development team.
