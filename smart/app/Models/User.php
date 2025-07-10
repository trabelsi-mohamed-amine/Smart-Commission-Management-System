<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdministrator()
    {
        return $this->role === 'administrator';
    }

    public function isCommissionMember()
    {
        return $this->role === 'commission_member';
    }

    public function isCommissionManager()
    {
        return $this->role === 'commission_manager';
    }

    /**
     * Check if user can manage other users
     */
    public function canManageUsers()
    {
        return $this->isAdministrator();
    }

    /**
     * Get the meetings that the user is participating in
     */
    public function meetingsAsParticipant()
    {
        return $this->hasMany(MeetingParticipant::class);
    }

    /**
     * Get the meetings that the user manages (as commission manager)
     */
    public function managedMeetings()
    {
        return $this->hasManyThrough(
            Meeting::class,
            Commission::class,
            'manager_id', // Foreign key on commissions table...
            'commission_id', // Foreign key on meetings table...
            'id', // Local key on users table...
            'id' // Local key on commissions table...
        );
    }

    /**
     * Get commissions that the user is a member of
     */
    public function commissions()
    {
        return $this->belongsToMany(Commission::class, 'commission_members', 'user_id', 'commission_id');
    }

    /**
     * Get commissions that the user manages (as commission manager)
     */
    public function managedCommissions()
    {
        return $this->hasMany(Commission::class, 'manager_id');
    }


}
