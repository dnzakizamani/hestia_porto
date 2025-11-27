<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Artist extends Model
{
    use HasFactory;

    // Field yang bisa diisi
    protected $fillable = [
        'name',
        'bio',
        'about_me',
        'profile_picture',
        'active',
        'user_id',
    ];

    // Field boolean
    protected $casts = [
        'active' => 'boolean',
    ];

    // Relasi: Artist punya banyak Project
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    // Relasi: Artist punya banyak ArtistContact
    public function contacts()
    {
        return $this->hasMany(ArtistContact::class);
    }

    // Scope untuk mendapatkan artist aktif
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    // Method untuk mengatur satu artist sebagai aktif dan menghapus aktif dari yang lain
    public static function setActive($id)
    {
        DB::transaction(function () use ($id) {
            // Hilangkan status aktif dari semua artist
            self::where('active', true)->update(['active' => false]);

            // Set artist yang dipilih sebagai aktif
            self::where('id', $id)->update(['active' => true]);
        });
    }
}
