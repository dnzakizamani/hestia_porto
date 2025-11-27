<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    protected $appends = ['image_url'];

    // Accessor for image_path to ensure proper URL formatting
    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            // Return a relative path that works with the frontend
            return '/storage/' . $this->image_path;
        }
        return null;
    }
}
