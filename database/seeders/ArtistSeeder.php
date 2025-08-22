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
        if (!Artist::where('name', 'Default Artist')->exists()) {
            Artist::create([
                'name'  => 'Default Artist',
                'bio'   => 'Artist default untuk project awal.',
            ]);
        }
        if (!Artist::where('name', 'Default Artist2')->exists()) {
            Artist::create([
                'name'  => 'Default Artist2',
                'bio'   => 'Artist default untuk project awal.',
            ]);
        }
        if (!Artist::where('name', 'Default Artist3')->exists()) {
            Artist::create([
                'name'  => 'Default Artist3',
                'bio'   => 'Artist default untuk project awal.',
            ]);
        }
    }
}
