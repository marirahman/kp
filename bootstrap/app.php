<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. Konfigurasi Enkripsi Cookie
        // Mengecualikan cookie tampilan agar tidak dienkripsi (opsional, bawaan template)
        $middleware->encryptCookies(except: [
            'appearance',
            'sidebar_state',
        ]);

        // 2. Middleware Web Standar (Wajib untuk Inertia/React)
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // 3. Alias Middleware Custom (PENTING untuk Role Admin)
        // Ini mendaftarkan kata kunci 'admin' yang kita pakai di routes/web.php
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminOnly::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Tempat konfigurasi handling error custom jika diperlukan
    })->create();