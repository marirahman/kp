import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payment', href: '/payment' },
];

// Tipe Data
interface Payment {
    id: number;
    order_id: number;
    bank_name: string;
    account_name: string;
    amount: number;
    proof_image: string;
    status: 'pending' | 'verified' | 'rejected';
    created_at: string;
    order: {
        customer_name: string;
    };
}

export default function PaymentManagement({ payments }: { payments: Payment[] }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Helper Format Rupiah
    const formatRupiah = (num: number) => "Rp " + Math.round(num).toLocaleString("id-ID");

    // Helper Badge Status
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'verified': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    // Aksi Verifikasi
    const handleVerify = (id: number) => {
        if(confirm('Terima pembayaran ini? Status pesanan akan menjadi Lunas.')) {
            router.post(`/payment/${id}/verify`, {}, {
                onSuccess: () => toast.success('Pembayaran diterima!'),
            });
        }
    };

    // Aksi Tolak
    const handleReject = (id: number) => {
        if(confirm('Tolak pembayaran ini? User harus upload ulang.')) {
            router.post(`/payment/${id}/reject`, {}, {
                onSuccess: () => toast.error('Pembayaran ditolak.'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Pembayaran" />
            
            <div className="p-6 flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Pembayaran</h2>
                        <p className="text-sm text-gray-500">Verifikasi bukti transfer dari pelanggan.</p>
                    </div>
                </div>

                {/* Tabel Pembayaran */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengirim</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                {payments.length === 0 ? (
                                    <tr><td colSpan={7} className="p-6 text-center text-gray-500">Belum ada data pembayaran.</td></tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(payment.created_at).toLocaleDateString('id-ID')}
                                                <br/>
                                                <span className="text-xs text-gray-400">Order #{payment.order_id}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{payment.account_name}</p>
                                                <p className="text-xs text-gray-500">Pelanggan: {payment.order.customer_name}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                {payment.bank_name.toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono font-bold text-blue-600">
                                                {formatRupiah(payment.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button 
                                                    onClick={() => setPreviewImage(`/storage/${payment.proof_image}`)}
                                                    className="text-xs bg-gray px-2 py-1 rounded border hover:bg-gray-500 transition"
                                                >
                                                    📷 Lihat Foto
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusBadge(payment.status)} uppercase`}>
                                                    {payment.status === 'verified' ? 'Diterima' : (payment.status === 'rejected' ? 'Ditolak' : 'Menunggu')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {payment.status === 'pending' ? (
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleVerify(payment.id)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                                                            title="Terima Pembayaran"
                                                        >
                                                            ✔ Terima
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(payment.id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                                                            title="Tolak Pembayaran"
                                                        >
                                                            ✖ Tolak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Selesai</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL PREVIEW GAMBAR */}
            {previewImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative bg-white p-2 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
                        <button 
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg"
                        >
                            &times;
                        </button>
                        <img 
                            src={previewImage} 
                            alt="Bukti Transfer" 
                            className="max-w-full h-auto rounded"
                        />
                        <div className="text-center mt-2">
                            <a href={previewImage} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                                Buka ukuran penuh
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </AppLayout>
    );
}