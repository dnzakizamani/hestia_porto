<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtistContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'artist_id',
        'platform',
        'remix_icon',
        'value',
    ];

    // Relasi: ArtistContact milik satu Artist
    public function artist()
    {
        return $this->belongsTo(Artist::class);
    }
}
