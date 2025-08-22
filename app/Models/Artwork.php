<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'image_path',
    ];

    // Relasi: Artwork milik 1 Project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
