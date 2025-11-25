import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

// --- HELPER FORMAT ---
const formatRupiah = (num: number) => {
    return "Rp " + Math.round(num).toLocaleString("id-ID");
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
};

// Badge untuk Status Pengerjaan (Work Status)
const getWorkStatusBadge = (status: string) => {
    switch(status) {
        case 'Selesai': return 'bg-green-100 text-green-700 border-green-200';
        case 'Diproses': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

// Badge untuk Status Pembayaran (Payment Status)
const getPaymentStatusBadge = (status: string) => {
    switch(status) {
        case 'Lunas': return 'bg-green-100 text-green-700';
        case 'DP': return 'bg-blue-100 text-blue-700';
        case 'Menunggu Verifikasi': return 'bg-yellow-100 text-yellow-700';
        case 'Bukti Ditolak': return 'bg-red-100 text-red-700';
        case 'Belum Cukup DP': return 'bg-orange-100 text-orange-700';
        default: return 'bg-gray-100 text-gray-600'; // Belum Bayar
    }
};

// --- KOMPONEN MODAL PEMBAYARAN ---
const PaymentModal = ({ order, onClose }: { order: any, onClose: () => void }) => {
    
    const targetDP = order.total_price * 0.5;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        bank_name: 'BCA',
        account_name: '',
        amount: '', // Biarkan string kosong agar placeholder muncul
        proof_image: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/order/${order.id}/pay`, {
            onSuccess: () => {
                toast.success("Bukti terkirim! Mohon tunggu verifikasi admin.");
                reset();
                onClose();
            },
            onError: () => toast.error("Gagal mengirim bukti."),
            forceFormData: true,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Upload Bukti Transfer</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>
                
                {/* Alert Info Status */}
                {order.payment_status === 'Bukti Ditolak' && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                        <strong>Mohon Maaf.</strong> Bukti pembayaran sebelumnya ditolak. Silakan upload bukti yang valid.
                    </div>
                )}
                {order.payment_status === 'Belum Cukup DP' && (
                    <div className="mb-4 p-3 bg-orange-50 text-orange-700 text-sm rounded-lg border border-orange-200">
                        <strong>Belum Cukup DP.</strong> Total pembayaran belum mencapai 50%. Silakan transfer kekurangannya.
                    </div>
                )}

                {/* Info Tagihan */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Total Harga:</span>
                        <span className="font-bold">{formatRupiah(order.total_price)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700">
                        <span>Target DP (50%):</span>
                        <span className="font-bold">{formatRupiah(targetDP)}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-blue-200 text-center">
                        <p className="text-lg font-bold text-gray-800">BCA 123-456-7890</p>
                        <p className="text-sm text-gray-600">a.n Bengkel Las ATJ</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim</label>
                        <input 
                            type="text" 
                            value={data.account_name} 
                            onChange={e => setData('account_name', e.target.value)} 
                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500" 
                            placeholder="Nama di rekening Anda"
                            required 
                        />
                        {errors.account_name && <p className="text-red-500 text-xs mt-1">{errors.account_name}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Transfer</label>
                        <input 
                            type="number" 
                            value={data.amount} 
                            onChange={e => setData('amount', e.target.value as any)} 
                            className="w-full border rounded-lg p-2.5 font-mono text-lg" 
                            placeholder="Rp 0"
                            required 
                            min={10000}
                        />
                        <p className="text-xs text-gray-500 mt-1">*Masukkan nominal yang Anda transfer.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti</label>
                        <input 
                            type="file" 
                            onChange={e => setData('proof_image', e.target.files ? e.target.files[0] : null)} 
                            className="w-full border rounded-lg p-2 text-sm" 
                            accept="image/*"
                            required
                        />
                        {errors.proof_image && <p className="text-red-500 text-xs mt-1">{errors.proof_image}</p>}
                    </div>
                    
                    <div className="flex gap-3 justify-end mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium">Batal</button>
                        <button type="submit" disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium shadow-lg disabled:opacity-50">
                            {processing ? 'Mengirim...' : 'Kirim Bukti'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- HALAMAN UTAMA ---
export default function MyOrders({ auth, orders }: { auth: any, orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head title="Pesanan Saya" />

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2">
                        ← Beranda
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">Login sebagai</p>
                        <p className="text-sm font-semibold text-blue-600">{auth.user.name}</p>
                    </div>
                    <Link 
                        href="/logout" 
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

      {/* KONTEN */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Pesanan Saya</h1>
                <p className="text-sm text-gray-500 mt-1">Pantau status pengerjaan & pembayaran Anda.</p>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                {orders.length} Pesanan
            </span>
        </div>

        <div className="space-y-6">
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-semibold text-gray-900">Belum ada pesanan</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">Yuk, konsultasikan kebutuhan konstruksi Anda sekarang!</p>
                     <Link 
                        href={route('my.orders.create')} // Pastikan rute ini ada di web.php
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        + Buat Pesanan Baru
                    </Link>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        
                        {/* Header Kartu */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">ORDER #{order.id}</span>
                                <span className="text-sm text-gray-500">| {formatDate(order.order_date)}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getWorkStatusBadge(order.work_status)}`}>
                                {order.work_status.toUpperCase()}
                            </span>
                        </div>

                        {/* Body Kartu */}
                        <div className="px-6 py-4">
                            <div className="space-y-4">
                                {order.details.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 text-xl flex-shrink-0 border border-blue-100">🛠️</div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-base">{item.product_type}</h4>
                                            <p className="text-sm text-gray-500">Detail: <span className="font-medium text-gray-700">{item.material}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-0.5">Jumlah</p>
                                            <p className="text-sm font-bold text-gray-900">{parseFloat(item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Kartu */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Status Pembayaran</p>
                                <span className={`text-sm font-bold px-2 py-0.5 rounded ${getPaymentStatusBadge(order.payment_status)}`}>
                                    {order.payment_status}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Total Biaya</p>
                                    <p className="text-xl font-bold text-blue-700 font-mono">{formatRupiah(order.total_price)}</p>
                                </div>
                                
                                {/* TOMBOL BAYAR: HILANG JIKA SUDAH LUNAS ATAU MENUNGGU VERIFIKASI */}
                                {order.payment_status !== 'Lunas' && order.payment_status !== 'Menunggu Verifikasi' && (
                                     <button 
                                        onClick={() => setSelectedOrder(order)}
                                        className="bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-600 shadow-sm transition flex items-center gap-2"
                                     >
                                        <span>💳</span> {order.payment_status === 'DP' || order.payment_status === 'Belum Cukup DP' ? 'Lunasi / Tambah' : 'Bayar Sekarang'}
                                     </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </main>

      {/* Modal Pembayaran */}
      {selectedOrder && (
        <PaymentModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}