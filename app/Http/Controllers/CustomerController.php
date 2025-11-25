<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CustomerController extends Controller
{
   public function index() {
    // Ambil pesanan dimana nomer HP sama dengan user login (Asumsi sederhana)
    // Atau idealnya relasi user_id, tapi kita pakai phone/email dulu sesuai struktur yg ada
    $orders = \App\Models\Order::where('customer_name', auth()->user()->name)
                ->orWhere('customer_phone', auth()->user()->email) // Contoh matching
                ->with('details')
                ->orderBy('created_at', 'desc')
                ->get();

    return \Inertia\Inertia::render('MyOrders', ['orders' => $orders]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // Validasi simpel (User tidak perlu isi bahan baku)
        $val = $request->validate([
            'customer_address' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'order_date' => 'required|date',
            // Kita manfaatkan 'product_type' di tabel order_details nanti, 
            // tapi sementara kita simpan deskripsi produk di sini atau buat kolom baru.
            // Agar simpel, kita simpan jenis produk di 'customer_name' sementara atau
            // Idealnya tabel orders punya kolom 'description'. 
            // TAPI, untuk sekarang kita pakai trik: 
            // Kita buat 1 dummy detail order agar admin tahu ini produk apa.
            'product_type' => 'required|string', 
            'description' => 'nullable|string', // Keterangan tambahan (ukuran dll)
        ]);

        // Simpan Order Utama
        $order = Order::create([
            'customer_name' => $user->name, // Otomatis nama user
            'customer_phone' => $val['customer_phone'],
            'customer_address' => $val['customer_address'],
            'work_status' => 'Menunggu', // Default
            'payment_status' => 'Belum Bayar',
            'order_date' => $val['order_date'],
            'total_price' => 0, // Harga 0 dulu karena belum dihitung Admin
            'total_cost' => 0,
        ]);

        // Simpan Detail Dummy (Agar Admin tahu user minta apa)
        // Nanti Admin yang akan edit dan tambahkan bahan sungguhan
        \App\Models\OrderDetail::create([
            'order_id' => $order->id,
            'product_type' => $val['product_type'], // "Pagar Minimalis"
            'material' => $val['description'] ?? 'Menunggu Survei', // "Ukuran 10x2 meter"
            'quantity' => 1,
            'price' => 0,
            'subtotal' => 0,
            'size' => '-'
        ]);

        return redirect()->route('my.orders')->with('success', 'Pesanan berhasil dibuat! Tunggu Admin menghitung biayanya.');
    }
}
