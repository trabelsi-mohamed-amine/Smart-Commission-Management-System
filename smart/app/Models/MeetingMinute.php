<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingMinute extends Model
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
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
