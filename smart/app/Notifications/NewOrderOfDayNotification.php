<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderOfDayNotification extends Notification
{

    protected $commission;
    protected $oldOrderOfDay;
    protected $newOrderOfDay;

    /**
     * Create a new notification instance.
     */
    public function __construct($commission, $oldOrderOfDay, $newOrderOfDay)
    {
        $this->commission = $commission;
        $this->oldOrderOfDay = $oldOrderOfDay;
        $this->newOrderOfDay = $newOrderOfDay;
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
                    ->subject('Ordre du jour modifié - ' . $this->commission->name)
                    ->greeting('Bonjour ' . $notifiable->name . ',')
                    ->line('L\'ordre du jour de la commission "' . $this->commission->name . '" a été mis à jour.')
                    ->line('Nouvel ordre du jour:')
                    ->line($this->newOrderOfDay)
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
            'old_order_of_day' => $this->oldOrderOfDay,
            'new_order_of_day' => $this->newOrderOfDay,
            'message' => 'L\'ordre du jour de la commission a été mis à jour',
        ];
    }
}
