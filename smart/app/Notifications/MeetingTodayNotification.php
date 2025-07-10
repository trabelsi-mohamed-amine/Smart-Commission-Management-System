<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingTodayNotification extends Notification
{

    protected $meeting;

    /**
     * Create a new notification instance.
     */
    public function __construct($meeting)
    {
        $this->meeting = $meeting;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $meetingUrl = url('/dashboard/meetings/' . $this->meeting->id);

        return (new MailMessage)
                    ->subject('Rappel: Réunion aujourd\'hui - ' . $this->meeting->title)
                    ->greeting('Bonjour ' . $notifiable->name . ',')
                    ->line('Nous vous rappelons que vous avez une réunion aujourd\'hui.')
                    ->line('Titre: ' . $this->meeting->title)
                    ->line('Heure: ' . $this->meeting->time)
                    ->line('Commission: ' . ($this->meeting->commission ? $this->meeting->commission->name : 'N/A'))
                    ->action('Voir détails de la réunion', $meetingUrl)
                    ->line('Merci d\'utiliser notre application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'meeting_id' => $this->meeting->id,
            'meeting_title' => $this->meeting->title,
            'meeting_time' => $this->meeting->time,
            'commission_id' => $this->meeting->commission_id,
            'commission_name' => $this->meeting->commission->name ?? 'N/A',
            'message' => 'Vous avez une réunion aujourd\'hui',
        ];
    }
}
