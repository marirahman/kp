<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PaymentController extends Controller
{

      public function index()
    {
        // Ambil semua pembayaran, urutkan dari yang terbaru
        // Kita load 'order' supaya tahu ini pembayaran untuk pesanan siapa
        $payments = Payment::with('order')->orderBy('created_at', 'desc')->get();

        return Inertia::render('PaymentManagement', [
            'payments' => $payments
        ]);
    }

    public function store(Request $request, $orderId)
    {
        $request->validate([
            'bank_name' => 'required|string',
            'account_name' => 'required|string',
            'amount' => 'required|numeric',
            'proof_image' => 'required|image|max:2048', // Max 2MB
        ]);

        $order = Order::findOrFail($orderId);

        // Simpan Gambar
        $path = $request->file('proof_image')->store('payments', 'public');

        // Simpan Data Pembayaran
        Payment::create([
            'order_id' => $order->id,
            'bank_name' => $request->bank_name,
            'account_name' => $request->account_name,
            'amount' => $request->amount,
            'proof_image' => $path,
            'status' => 'pending',
        ]);

        // Update status order sementara
        $order->update(['payment_status' => 'Menunggu Verifikasi']);

        return back()->with('success', 'Bukti pembayaran berhasil dikirim! Menunggu verifikasi admin.');
    }
    
    // Fitur Admin: Verifikasi
    public function verify($paymentId) {
        $payment = Payment::findOrFail($paymentId);
        $payment->update(['status' => 'verified']);
        
        // Update Order jadi Lunas (atau DP tergantung logika bisnis)
        $payment->order->update(['payment_status' => 'Lunas']);
        
        return back()->with('success', 'Pembayaran diverifikasi.');
    }
    
    // Fitur Admin: Tolak
    public function reject($paymentId) {
        $payment = Payment::findOrFail($paymentId);
        $payment->update(['status' => 'rejected']);
        $payment->order->update(['payment_status' => 'Gagal/Ditolak']);
        
        return back()->with('success', 'Pembayaran ditolak.');
    }
}