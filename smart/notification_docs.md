# Notifications System Documentation

This system provides automatic notifications to users for three events:
1. When a meeting is scheduled for today
2. When the order of day for a commission is updated
3. When a new commission is created

## Setup

The notification system is designed with multiple approaches to ensure reliability:

1. Three notification classes:
   - `MeetingTodayNotification` - Sent to meeting participants when a meeting is scheduled for today
   - `NewOrderOfDayNotification` - Sent when a commission's order of day is updated
   - `NewCommissionNotification` - Sent to administrators and commission managers when a new commission is created

2. Three methods for delivering meeting notifications:
   - **Middleware-Based Detection**: Checks for today's meetings when a user logs in or accesses protected routes
   - **API-Based Polling**: Frontend can check for today's meetings periodically
   - **Client-Side Browser Notifications**: Shows desktop notifications for meetings

3. Command classes that handle sending notifications (legacy approach):
   - `NotifyTodayMeetings` - Checks for meetings scheduled for today and notifies participants
   - `NotifyOrderOfDayChanged` - Monitors changes to commission order of day and sends notifications

## Delivery Channels

Notifications are sent through two channels:
- Email: Users receive an email notification
- Database: Notifications are stored in the database for displaying in the application UI

## Testing

You can test the notification system using these test scripts:

1. Test the non-scheduler approach (recommended):
```bash
php test_non_scheduler_notifications.php
```

2. Test the commission notification feature:
```bash
php test_commission_notification.php
```

3. Test the legacy command-based approach:
```bash
php test_notification_commands.php
```

## How Notifications Work (Scheduler-Free Approach)

The new notification system works without relying on the Laravel scheduler, making it more portable and reliable:

### 1. Middleware-Based Notifications

When a user logs in or accesses a protected route, the `CheckTodayMeetings` middleware:
- Checks if the user has meetings scheduled for today
- Uses cache to prevent duplicate notifications
- Sends notifications if meetings are found

### 2. API Endpoint for Client-Side Checks

The system provides an API endpoint to fetch today's meetings:
```
GET /api/meetings/today
```

This endpoint:
- Returns meetings where the authenticated user is a participant or manager
- Is used by the frontend to check for meetings periodically

### 3. Client-Side Notification Service

The frontend includes a notification service that:
- Checks for today's meetings when the app initializes
- Periodically polls for new meetings (every 10 minutes by default)
- Shows browser notifications or toast alerts for meetings

## Displaying Notifications in the UI

To display notifications in your application's user interface, you can retrieve them using Laravel's notification system:

```php
// In your controller
$notifications = auth()->user()->notifications;

// Or just unread notifications
$unreadNotifications = auth()->user()->unreadNotifications;

// Mark as read
auth()->user()->unreadNotifications->markAsRead();
```

Then you can display them in your Vue.js or React frontend by passing them from your API to your frontend.

## Customizing Notifications

You can customize the notification messages by editing the notification classes:
- `app/Notifications/MeetingTodayNotification.php`
- `app/Notifications/NewOrderOfDayNotification.php`

## Adding New Notification Types

To add a new notification type:

1. Create a new notification class:
   ```
   php artisan make:notification YourNewNotification
   ```

2. Implement the notification channels and content in the new class

3. If using the middleware approach, update the middleware to include your new notification logic

4. If using the client-side approach, update the frontend notification service

## Implementation Details

### Backend Files

| File | Purpose |
|------|---------|
| `app/Http/Middleware/CheckTodayMeetings.php` | Middleware that checks for today's meetings when users access the application |
| `app/Http/Controllers/API/MeetingNotificationController.php` | Controller that provides today's meetings via API endpoint |
| `app/Notifications/MeetingTodayNotification.php` | Notification class for today's meetings |

### Frontend Files

| File | Purpose |
|------|---------|
| `template/src/services/MeetingNotificationService.js` | Client-side service that checks for meetings and shows notifications |
| `template/src/layouts/MainLayout.jsx` | Layout component that triggers meeting checks on dashboard access |
| `template/src/App.jsx` | Main app component that initializes the notification service |

### Route Configuration

```php
Route::get('/api/meetings/today', [MeetingNotificationController::class, 'todayMeetings'])
    ->middleware('auth')
    ->name('meetings.today');
```

## Advantages over Scheduler-Based Approach

1. **Cross-Platform Compatibility**: Works on any platform without OS-specific configuration
2. **Instant Notifications**: Users get notifications immediately upon login
3. **No Server Configuration**: No need to set up cron jobs or task schedulers
4. **Resource-Efficient**: Only checks for notifications for active users
5. **Resilient**: Multiple notification paths ensure users don't miss important meetings
