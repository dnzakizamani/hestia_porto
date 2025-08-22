<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    use HasFactory;

    // Field yang bisa diisi
    protected $fillable = [
        'name',
        'bio',
        'profile_picture',
    ];

    // Relasi: Artist punya banyak Project
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
