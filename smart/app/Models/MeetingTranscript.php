<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingTranscript extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'title',
        'content',
        'summary',
        'decisions',
        'actions',
        'status',
        'file_path',
        'validated_by',
        'validated_at',
        'created_by',
        'feedback',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
