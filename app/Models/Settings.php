<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Settings extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    protected $casts = [
        'value' => 'json',
    ];

    protected $appends = ['logo_url'];

    // Accessor for logo URL
    public function getLogoUrlAttribute()
    {
        if ($this->key === 'website_logo' && $this->value) {
            $logoPath = json_decode($this->value, true)['path'] ?? null;
            if ($logoPath) {
                return '/storage/' . $logoPath;
            }
        }
        return null;
    }

    // Static method to get setting by key
    public static function getByKey($key)
    {
        return static::where('key', $key)->first();
    }

    // Static method to set/update setting
    public static function setByKey($key, $value)
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}