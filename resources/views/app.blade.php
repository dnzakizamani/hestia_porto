<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Remix Icon -->
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />

    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body class="antialiased">
    {{-- <div id="portal-root"></div> --}}
    @inertia

</body>
</html>
