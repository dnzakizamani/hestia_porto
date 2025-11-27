<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class FaviconController extends Controller
{
    public function index(Request $request)
    {
        // Get the website logo setting
        $logoSetting = Settings::getByKey('website_logo');

        if ($logoSetting && $logoSetting->value) {
            $logoPath = json_decode($logoSetting->value, true)['path'] ?? null;

            if ($logoPath && Storage::exists($logoPath)) {
                $fileContents = Storage::get($logoPath);
                $mimeType = Storage::mimeType($logoPath);

                // Convert to appropriate format if needed
                // Most browsers support PNG and JPEG as favicon
                $fileExtension = strtolower(pathinfo($logoPath, PATHINFO_EXTENSION));

                // If it's not a supported favicon format, we might want to convert it
                // For now, we'll serve it as is since most modern browsers support PNG/JPG as favicons
                $response = Response::make($fileContents);
                $response->header('Content-Type', $mimeType);
                $response->header('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

                return $response;
            }
        }

        // If no custom favicon found, return a 404 so browser uses default behavior
        // Or we could return a default favicon if desired
        return response('', 404);
    }
}