<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        return Inertia::render('CargoStylePortfolio', [
            'projects' => Project::with('category')->with('artworks')->get(),
        ]);
    }
}
