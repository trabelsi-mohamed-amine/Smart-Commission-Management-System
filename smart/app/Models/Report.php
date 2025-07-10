<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'title', 'summary', 'decisions', 'actions', 'responsable', 'deadline'
    ];
}
