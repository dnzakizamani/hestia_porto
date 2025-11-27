<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>About - Hestia Porto</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8">About Artist</h1>
        
        @if($activeArtist)
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            @if($activeArtist->profile_picture)
                <div class="flex justify-center mb-6">
                    <img 
                        src="{{ Storage::url($activeArtist->profile_picture) }}" 
                        alt="{{ $activeArtist->name }}" 
                        class="w-32 h-32 rounded-full object-cover border-4 border-amber-300"
                    >
                </div>
            @endif
            
            <h2 class="text-2xl font-bold text-center mb-4">{{ $activeArtist->name }}</h2>
            
            <div class="mb-4">
                <h3 class="text-lg font-semibold mb-2">Bio</h3>
                <p class="text-gray-700">{{ $activeArtist->bio }}</p>
            </div>
            
            <div>
                <h3 class="text-lg font-semibold mb-2">About Me</h3>
                <div class="text-gray-700 prose">
                    {!! nl2br(e($activeArtist->about_me)) !!}
                </div>
            </div>
        </div>
        @else
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
            <p class="text-gray-700">No artist information available.</p>
        </div>
        @endif
    </div>
</body>
</html>