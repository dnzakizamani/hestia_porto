<?php

namespace App\Http\Controllers;

use App\Models\Artist;
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

        return view('about', compact('activeArtist'));
    }
}
