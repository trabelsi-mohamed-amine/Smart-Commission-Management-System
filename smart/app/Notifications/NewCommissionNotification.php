<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Commission;

class NewCommissionNotification extends Notification
{
    use Queueable;

    protected $commission;

    /**
     * Create a new notification instance.
     */
    public function __construct(Commission $commission)
    {
        $this->commission = $commission;
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
        $commissionUrl = url('/dashboard/commissions/' . $this->commission->id);

        return (new MailMessage)
                    ->subject('Nouvelle Commission Créée - ' . $this->commission->name)
                    ->greeting('Bonjour ' . $notifiable->name . ',')
                    ->line('Une nouvelle commission a été créée: "' . $this->commission->name . '".')
                    ->line('Description: ' . ($this->commission->description ?? 'Aucune description'))
                    ->action('Voir la commission', $commissionUrl)
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
            'commission_id' => $this->commission->id,
            'commission_name' => $this->commission->name,
            'message' => 'Une nouvelle commission a été créée',
            'description' => $this->commission->description ?? 'Aucune description',
            'created_at' => $this->commission->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
