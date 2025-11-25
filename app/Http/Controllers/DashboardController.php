<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\RawMaterial;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil semua pesanan untuk dihitung
        $allOrders = Order::all();

        // 2. Hitung Statistik Utama
        $totalRevenue = $allOrders->sum('total_price'); // Total Pendapatan
        $totalCost    = $allOrders->sum('total_cost');    // Total Modal
        $totalProfit  = $totalRevenue - $totalCost;    // Total Keuntungan
        $totalOrders  = $allOrders->count();

        // 3. Ambil 5 Pesanan Terbaru (untuk Laporan Profit per Pesanan)
        $recentOrders = Order::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                // Tambahkan properti 'profit' ke setiap pesanan
                $order->profit = $order->total_price - $order->total_cost;
                return $order;
            });

        // 4. Ambil Laporan Stok Kritis (Stok di bawah 10)
        $lowStockItems = RawMaterial::where('stock', '<=', 10)
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get();

        // 5. Kirim semua data ini ke halaman Dashboard
        return Inertia::render('dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalCost'    => $totalCost,
                'totalProfit'  => $totalProfit,
                'totalOrders'  => $totalOrders,
            ],
            'recentOrders' => $recentOrders,
            'lowStockItems' => $lowStockItems,
        ]);
    }
}