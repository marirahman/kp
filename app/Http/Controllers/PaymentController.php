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
        $order = Order::findOrFail($orderId);
        
        // Validasi: KITA HAPUS BATAS MINIMAL DI SINI
        // User boleh transfer berapapun untuk dicicil
        $request->validate([
            'bank_name' => 'required|string',
            'account_name' => 'required|string',
            'amount' => 'required|numeric|min:10000', // Minimal 10rb wajar
            'proof_image' => 'required|image|max:2048',
        ]);

        $path = $request->file('proof_image')->store('payments', 'public');

        Payment::create([
            'order_id' => $order->id,
            'bank_name' => $request->bank_name,
            'account_name' => $request->account_name,
            'amount' => $request->amount,
            'proof_image' => $path,
            'status' => 'pending',
        ]);

        // Update status order
        $order->update(['payment_status' => 'Menunggu Verifikasi']);

        return back()->with('success', 'Bukti pembayaran diterima! Menunggu pengecekan admin.');
    }
    
    // Fitur Admin: Verifikasi Cerdas (Akumulasi)
    public function verify($paymentId) {
        $payment = Payment::findOrFail($paymentId);
        $order = $payment->order;

        // 1. Tandai pembayaran ini sah
        $payment->update(['status' => 'verified']);

        // 2. Hitung TOTAL uang yang sudah masuk (semua yang verified)
        $totalPaid = $order->payments()->where('status', 'verified')->sum('amount');
        
        // 3. Tentukan Status Pesanan berdasarkan akumulasi
        if ($totalPaid >= $order->total_price) {
            // Lunas
            $order->update(['payment_status' => 'Lunas']);
        } elseif ($totalPaid >= ($order->total_price * 0.5)) {
            // Sudah mencapai 50% -> Masuk DP (Proses Kerja dimulai)
            $order->update(['payment_status' => 'DP']);
        } else {
            // Belum sampai 50% -> Minta transfer lagi
            $order->update(['payment_status' => 'Belum Cukup DP']); 
        }
        
        return back()->with('success', "Pembayaran diverifikasi. Total masuk: Rp " . number_format($totalPaid));
    }
    
    // Fitur Admin: Tolak
    public function reject($paymentId) {
        $payment = Payment::findOrFail($paymentId);
        $payment->update(['status' => 'rejected']);
        $payment->order->update(['payment_status' => 'Gagal/Ditolak']);
        
        return back()->with('success', 'Pembayaran ditolak.');
    }
}