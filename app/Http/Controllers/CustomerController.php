<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $orders = Order::where('customer_name', $user->name)
                    ->orWhere('customer_phone', $user->email)
                    ->with('details')
                    ->orderBy('created_at', 'desc')
                    ->get();

        // --- PERBAIKAN: Langsung panggil 'MyOrders' ---
        return Inertia::render('MyOrders', [
            'orders' => $orders
        ]);
    }

    public function create()
    {
        // --- PERBAIKAN: Langsung panggil 'CreateOrder' ---
        return Inertia::render('CreateOrder', [
            'user' => Auth::user()
        ]);
    }
    
    public function store(Request $request)
    {
        $user = Auth::user();

        $val = $request->validate([
            'customer_address' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'order_date' => 'required|date',
            'product_type' => 'required|string', 
            'description' => 'nullable|string',
        ]);

        $order = Order::create([
            'customer_name' => $user->name,
            'customer_phone' => $val['customer_phone'],
            'customer_address' => $val['customer_address'],
            'work_status' => 'Menunggu',
            'payment_status' => 'Belum Bayar',
            'order_date' => $val['order_date'],
            'total_price' => 0,
            'total_cost' => 0,
        ]);

        OrderDetail::create([
            'order_id' => $order->id,
            'product_type' => $val['product_type'],
            'material' => $val['description'] ?? 'Menunggu Survei',
            'quantity' => 1,
            'price' => 0,
            'subtotal' => 0,
            'size' => '-'
        ]);

        return redirect()->route('my.orders')->with('success', 'Pesanan berhasil dibuat!');
    }
}