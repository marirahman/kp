import React from 'react';
import { Head, Link } from '@inertiajs/react';

// Helper Format Rupiah
const formatRupiah = (num: number) => {
    return "Rp " + Math.round(num).toLocaleString("id-ID");
};

// Helper Format Tanggal
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

// Helper Badge Status (Mirip Shopee)
const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
        case 'Diproses': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Menunggu': return 'bg-gray-100 text-gray-600 border-gray-200';
        default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
};

export default function MyOrders({ auth, orders }: { auth: any, orders: any[] }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head title="Pesanan Saya" />

      {/* --- NAVBAR SIMPLE KHUSUS USER --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                    {/* --- PERBAIKAN UTAMA DI SINI --- */}
                    <Link href="/" className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        Beranda
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">Login sebagai</p>
                        <p className="text-sm font-semibold text-blue-600">{auth.user.name}</p>
                    </div>
                    <Link 
                        href="/logout" // Gunakan URL manual /logout agar aman
                        method="post" 
                        as="button" 
                        className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                        Keluar
                    </Link>
                </div>
            </div>
        </div>
      </nav>

      {/* --- KONTEN UTAMA --- */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Halaman */}
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pesanan Saya</h1>
                <p className="text-sm text-gray-500">Pantau status pengerjaan proyek Anda di sini.</p>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {orders.length} Pesanan
            </span>
        </div>

        {/* LIST PESANAN */}
        <div className="space-y-6">
            {orders.length === 0 ? (
                // TAMPILAN JIKA KOSONG
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">
                        📦
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Belum ada pesanan</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">
                        Anda belum memiliki riwayat pesanan. Yuk, konsultasikan kebutuhan konstruksi Anda sekarang!
                    </p>
                    <Link 
                        href={route('my.orders.create')} // Pastikan rute ini ada di web.php
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        + Buat Pesanan Baru
                    </Link>
                </div>
            ) : (
                // LOOPING KARTU PESANAN
                orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        
                        {/* 1. Header Kartu (Nomor & Status) */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">ORDER</span>
                                    <span className="text-sm font-mono font-bold text-gray-700">#{order.id}</span>
                                </div>
                                <span className="hidden sm:inline text-gray-300">|</span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    📅 {formatDate(order.order_date)}
                                </span>
                            </div>
                            
                            {/* BADGE STATUS (SINKRON DENGAN ADMIN) */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadge(order.work_status)}`}>
                                {order.work_status.toUpperCase()}
                            </span>
                        </div>

                        {/* 2. Body Kartu (Detail Item) */}
                        <div className="px-6 py-4">
                            <div className="space-y-4">
                                {order.details.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        {/* Ikon Produk */}
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-xl flex-shrink-0 border border-blue-100">
                                            🛠️
                                        </div>
                                        
                                        {/* Info Produk */}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-base">
                                                {item.product_type}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                Material: <span className="font-medium text-gray-700">{item.material}</span>
                                            </p>
                                        </div>

                                        {/* Jumlah */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-0.5">Jumlah</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {parseFloat(item.quantity)} {item.unit || 'Unit'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Footer Kartu (Total & Pembayaran) */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-wrap justify-between items-center gap-4">
                            
                            {/* Status Pembayaran */}
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-gray-500">Status Pembayaran:</div>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                                    order.payment_status === 'Lunas' 
                                        ? 'bg-green-100 text-green-700' 
                                        : (order.payment_status === 'DP' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700')
                                }`}>
                                    {order.payment_status}
                                </span>
                            </div>

                            {/* Total Harga */}
                            <div className="text-right flex items-center gap-3">
                                <span className="text-sm text-gray-500">Total Pesanan:</span>
                                <span className="text-xl font-bold text-blue-700 font-mono">
                                    {formatRupiah(order.total_price)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </main>
    </div>
  );
}