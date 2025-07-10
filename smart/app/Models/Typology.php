<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Typology extends Model
{
    protected $fillable = ['title', 'description', 'icon'];

    public static function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255'
        ];
    }
}
