<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use App\Models\Settings;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function index()
    {
        // Ambil artist yang aktif
        $activeArtist = Artist::active()->first();

        // Jika tidak ada artist aktif, ambil artist pertama
        if (!$activeArtist) {
            $activeArtist = Artist::first();
        }

        // Get website logo setting for favicon
        $websiteLogo = Settings::getByKey('website_logo');

        return view('about', [
            'activeArtist' => $activeArtist,
            'faviconUrl' => $websiteLogo ? $websiteLogo->logo_url : null
        ]);
    }
}
