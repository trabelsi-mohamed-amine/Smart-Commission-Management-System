<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        $notifications = $user->notifications()->limit(50)->get()->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => class_basename($notification->type),
                'data' => $notification->data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
                'time_ago' => $notification->created_at->diffForHumans(),
            ];
        });

        return response()->json($notifications);
    }

    /**
     * Mark notifications as read
     */
    public function markAsRead(Request $request)
    {
        $user = Auth::user();

        // Mark all notifications as read if no IDs are provided
        if (!$request->has('ids') || empty($request->ids)) {
            $user->unreadNotifications->markAsRead();
            return response()->json(['message' => 'All notifications marked as read']);
        }

        // Mark specific notifications as read
        $user->notifications()
            ->whereIn('id', $request->ids)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notifications marked as read']);
    }

    /**
     * Get count of unread notifications
     */
    public function unreadCount()
    {
        $user = Auth::user();
        $count = $user->unreadNotifications()->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Delete a notification
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $user->notifications()->where('id', $id)->delete();

        return response()->json(['message' => 'Notification deleted']);
    }
}
