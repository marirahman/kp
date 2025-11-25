<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CustomerController; 
use App\Http\Controllers\PaymentController;

Route::get('/', function () {
    return Inertia::render('welcomeS');
})->name('home');

// Group untuk user yang SUDAH LOGIN (Auth)
Route::middleware(['auth', 'verified'])->group(function () {

    // 1. AREA PELANGGAN (Bisa diakses semua user login)
    // Halaman ini menampilkan pesanan milik user yang sedang login saja
    Route::get('/my-orders', [CustomerController::class, 'index'])->name('my.orders');
    Route::get('/new-order', [CustomerController::class, 'create'])->name('my.orders.create');
    Route::post('/new-order', [CustomerController::class, 'store'])->name('my.orders.store');

    // Upload Bukti (User)
    Route::post('/order/{id}/pay', [PaymentController::class, 'store'])->name('payment.store');

    // 2. AREA ADMIN (Dilindungi Middleware 'admin')
    // Hanya user dengan role='admin' yang bisa masuk ke sini.
    // Jika user biasa mencoba masuk, mereka akan dilempar ke /my-orders (lihat logic AdminOnly.php)
    Route::middleware(['admin'])->group(function () {
        
        // Dashboard Laporan
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/payment', [PaymentController::class, 'index'])->name('payment.index');
        Route::post('/payment/{id}/verify', [PaymentController::class, 'verify'])->name('payment.verify');
        Route::post('/payment/{id}/reject', [PaymentController::class, 'reject'])->name('payment.reject');

        // Manajemen Pesanan (Full CRUD)
        Route::prefix('order')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('order.index');
            Route::get('/{id}', [OrderController::class, 'show'])->name('order.show');
            Route::post('/', [OrderController::class, 'store'])->name('order.store');
            Route::put('/{id}', [OrderController::class, 'update'])->name('order.update');
            Route::delete('/{id}', [OrderController::class, 'destroy'])->name('order.destroy');
        });

        // Manajemen Stok Bahan (Full CRUD)
        Route::prefix('materials')->group(function () {
            Route::get('/', [RawMaterialController::class, 'index'])->name('materials.index');
            // Route::get('/list', [RawMaterialController::class, 'list'])->name('materials.list'); // Aktifkan jika ada method list
            Route::post('/', [RawMaterialController::class, 'store'])->name('materials.store');
            Route::put('/{id}', [RawMaterialController::class, 'update'])->name('materials.update');
            Route::delete('/{id}', [RawMaterialController::class, 'destroy'])->name('materials.destroy');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';