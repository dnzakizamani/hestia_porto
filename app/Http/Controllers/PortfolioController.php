<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Artist;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        // Ambil artist yang aktif dengan kontaknya
        $activeArtist = Artist::with('contacts')->active()->first();

        // Jika tidak ada artist aktif, ambil artist pertama dengan kontaknya
        if (!$activeArtist) {
            $activeArtist = Artist::with('contacts')->first();
        }

        // Jika ada artist, buat versi yang telah disanitasi untuk dikirim ke frontend
        $sanitizedArtist = null;
        if ($activeArtist) {
            $sanitizedArtist = $activeArtist->toArray();

            // Sanitasi data utama
            $sanitizedArtist['name'] = e($sanitizedArtist['name']);
            $sanitizedArtist['bio'] = e($sanitizedArtist['bio']);
            $sanitizedArtist['about_me'] = e($sanitizedArtist['about_me']);

            // Sanitasi data kontak juga
            if (isset($sanitizedArtist['contacts'])) {
                foreach ($sanitizedArtist['contacts'] as &$contact) {
                    $contact['platform'] = e($contact['platform']);
                    $contact['value'] = e($contact['value']);
                }
            }
        }

        // Get website logo setting
        $websiteLogo = \App\Models\Settings::getByKey('website_logo');

        return Inertia::render('CargoStylePortfolio', [
            'projects' => Project::with(['category', 'artworks'])->get()->toArray(),
            'activeArtist' => $sanitizedArtist,
            'websiteLogo' => $websiteLogo ? $websiteLogo->logo_url : null,
            'faviconUrl' => $websiteLogo ? $websiteLogo->logo_url : null,
        ]);
    }
}

