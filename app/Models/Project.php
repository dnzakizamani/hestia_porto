<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'artist_id',
        'title',
        'description',
        'cover_image',
        'category_id',
    ];

    // Relasi: Project milik 1 Artist
    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }

    // Relasi: Project punya banyak Artwork
    public function artworks()
    {
        return $this->hasMany(Artwork::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    protected $appends = ['cover_image_url'];

    // Accessor for cover_image to ensure proper URL formatting
    public function getCoverImageUrlAttribute()
    {
        if ($this->cover_image) {
            // Return a relative path that works with the frontend
            return '/storage/' . $this->cover_image;
        }
        return null;
    }
}
