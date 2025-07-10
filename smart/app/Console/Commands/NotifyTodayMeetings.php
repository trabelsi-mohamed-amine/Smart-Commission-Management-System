<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\Meeting;
use App\Models\User;
use App\Models\MeetingParticipant;
use App\Notifications\MeetingTodayNotification;
use Carbon\Carbon;

class NotifyTodayMeetings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:notify-today-meetings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to participants for meetings scheduled today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today()->toDateString();

        // Get all meetings scheduled for today
        $meetings = Meeting::with('commission', 'participants.user')
            ->whereDate('date', $today)
            ->where('status', 'pending')
            ->get();

        $this->info("Found " . $meetings->count() . " meetings scheduled for today");

        foreach ($meetings as $meeting) {
            $this->info("Processing meeting: {$meeting->title}");

            // Get all participants for the meeting
            $participants = MeetingParticipant::with('user')
                ->where('meeting_id', $meeting->id)
                ->get();

            // Also notify any commission managers
            $commissionManagers = User::where('role', 'commission_manager')
                ->where(function($query) use ($meeting) {
                    $query->whereHas('managedCommissions', function($q) use ($meeting) {
                        $q->where('id', $meeting->commission_id);
                    });
                })
                ->get();

            $notifiedCount = 0;

            // Notify participants
            foreach ($participants as $participant) {
                if ($participant->user) {
                    $participant->user->notify(new MeetingTodayNotification($meeting));
                    $notifiedCount++;
                }
            }

            // Notify managers
            foreach ($commissionManagers as $manager) {
                $manager->notify(new MeetingTodayNotification($meeting));
                $notifiedCount++;
            }

            $this->info("Sent {$notifiedCount} notifications for meeting: {$meeting->title}");
            Log::info("Meeting today notifications sent", [
                'meeting_id' => $meeting->id,
                'meeting_title' => $meeting->title,
                'notification_count' => $notifiedCount
            ]);
        }

        $this->info("Meeting notifications processing completed");
    }
}
