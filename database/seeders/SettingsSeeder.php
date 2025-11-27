<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Settings;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update the website logo setting
        // Check if the setting already exists to avoid overwriting
        if (!Settings::where('key', 'website_logo')->exists()) {
            Settings::create([
                'key' => 'website_logo',
                'value' => json_encode(['path' => 'projects/website-name.jpg'])
            ]);
        }
    }
}
