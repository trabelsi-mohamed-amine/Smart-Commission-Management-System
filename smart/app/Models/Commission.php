<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    // Cette ligne est inutile si ta table s'appelle bien "commissions"
    // protected $table = 'commissions';

    protected $fillable = ['name', 'description', 'order_of_day', 'manager_id'];

    public function meetings()
    {
        return $this->hasMany(Meeting::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'commission_members', 'commission_id', 'user_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
