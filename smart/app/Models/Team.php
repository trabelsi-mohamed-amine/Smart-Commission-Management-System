<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'role', 'image'];

    // Optionnel : définir l'accès au chemin de l'image si nécessaire
    public function getImageAttribute($value)
    {
        return asset('storage/' . $value);  // Retourne l'URL complète de l'image
    }
}