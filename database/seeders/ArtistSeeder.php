<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Artist;

class ArtistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hanya buat kalau belum ada
        if (!Artist::where('name', 'hestia')->exists()) {
            Artist::create([
                'name'  => 'hestia',
                'bio'   => 'Artist default untuk project awal.',
                'about_me' => 'Seorang seniman digital dengan pengalaman lebih dari 5 tahun di bidang ilustrasi dan desain karakter. Saya mencintai dunia seni dan selalu berusaha menciptakan karya-karya yang bermakna dan memukau.',
                'profile_picture' => null,
                'active' => true, // Set sebagai aktif
            ]);
        }
    }
}
