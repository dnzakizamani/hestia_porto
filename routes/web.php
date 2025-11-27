<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\FaviconController;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');
Route::get('/about', [AboutController::class, 'index'])->name('about.index');

// Favicon route
Route::get('/favicon.ico', [FaviconController::class, 'index']);