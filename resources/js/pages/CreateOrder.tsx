import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function CreateOrder({ user }: { user: any }) {
  const { data, setData, post, processing, errors } = useForm({
    customer_phone: '',
    customer_address: '',
    order_date: '',
    product_type: '', // Cth: Pagar, Kanopi
    description: '', // Cth: Panjang 10 meter, warna hitam
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('my.orders.store'));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 py-10 px-4">
      <Head title="Buat Pesanan Baru" />
      
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold">Formulir Pemesanan</h1>
            <p className="text-blue-100 text-sm mt-1">Isi detail kebutuhan Anda, kami akan menghitung biayanya.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Info Otomatis */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <p className="text-sm text-gray-600">Nama Pemesan:</p>
                <p className="font-bold text-lg text-blue-800">{user.name}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
                    <input 
                        type="text" 
                        value={data.customer_phone}
                        onChange={e => setData('customer_phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="08..."
                        required
                    />
                    {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Diperlukan</label>
                    <input 
                        type="date" 
                        value={data.order_date}
                        onChange={e => setData('order_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Pemasangan</label>
                <textarea 
                    value={data.customer_address}
                    onChange={e => setData('customer_address', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Alamat lengkap lokasi..."
                    required
                />
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Detail Pekerjaan</h3>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Layanan</label>
                    <select 
                        value={data.product_type}
                        onChange={e => setData('product_type', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">-- Pilih Layanan --</option>
                        <option value="Pagar Besi">Pagar Besi</option>
                        <option value="Kanopi Baja Ringan">Kanopi Baja Ringan</option>
                        <option value="Tralis Jendela">Tralis Jendela</option>
                        <option value="Rangka Atap">Rangka Atap</option>
                        <option value="Lainnya">Lainnya (Custom)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Ukuran (Estimasi)</label>
                    <textarea 
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Contoh: Panjang pagar kira-kira 10 meter, tinggi 2 meter. Model minimalis warna hitam."
                    />
                    <p className="text-xs text-gray-500 mt-1">*Tim kami akan melakukan survei untuk ukuran pasti.</p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <Link href={route('my.orders')} className="text-gray-500 hover:text-gray-700 font-medium">Batal</Link>
                <button 
                    type="submit" 
                    disabled={processing}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
                >
                    {processing ? 'Mengirim...' : 'Kirim Pesanan'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}