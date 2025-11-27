<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ArtistContact;
use App\Models\Artist;

class ArtistContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil artist dengan ID 1 (hestia)
        $artist = Artist::find(1);

        if ($artist) {
            // Tambahkan beberapa contoh kontak
            $artist->contacts()->create([
                'platform' => 'Instagram',
                'remix_icon' => 'instagram-line',
                'value' => '@hestia_art',
            ]);

            $artist->contacts()->create([
                'platform' => 'Email',
                'remix_icon' => 'mail-line',
                'value' => 'hestia@example.com',
            ]);

            $artist->contacts()->create([
                'platform' => 'Behance',
                'remix_icon' => 'global-line',
                'value' => 'https://behance.net/hestia',
            ]);
        }
    }
}
