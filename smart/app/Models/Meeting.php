<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'commission_id',
        'date', // Champ date séparé
        'time',  // Champ heure séparé
        'participant_count' // Number of participants
    ];

    public function commission()
    {
        return $this->belongsTo(\App\Models\Commission::class);
    }

    public function transcripts()
    {
        return $this->hasMany(MeetingTranscript::class);
    }

    public function participants()
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    /**
     * Check if a user is a participant in this meeting
     *
     * @param int $userId
     * @return bool
     */
    public function isUserParticipant($userId)
    {
        return $this->participants()->where('user_id', $userId)->exists();
    }
}
