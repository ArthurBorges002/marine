<?php

use Illuminate\Support\Facades\Route;

// O backend é apenas a API (rotas em routes/api.php). O frontend é o app React em /frontend.
Route::get('/', fn () => response()->json([
    'app' => config('app.name'),
    'api' => url('/api'),
]));
