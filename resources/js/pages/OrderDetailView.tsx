import React from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

export default function OrderDetailView() {
  const { order } = usePage().props as any;

  // === FUNGSI FORMAT ===
  const formatRupiah = (angka: number | null | undefined) => {
    if (angka === null || angka === undefined) return "Rp 0";
    return `Rp ${Math.round(angka).toLocaleString("id-ID")}`;
  };
  
  // Format angka biasa (untuk jumlah/stok)
  const formatNumber = (angka: number | null | undefined) => {
    if (angka === null || angka === undefined) return "0";
    return Number(angka).toLocaleString("id-ID");
  };

  // Helper untuk badge status
  const getStatusBadge = (status: string, type: 'work' | 'payment') => {
    if (type === 'work') {
        switch (status) {
          case 'Selesai': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
          case 'Diproses': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    } else { // Payment
        switch (status) {
          case 'Lunas': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
          case 'DP': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
          default: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        }
    }
  };


  if (!order) {
    return (
      <AppLayout breadcrumbs={[{ title: "Memuat...", href: "/order" }]}>
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          Memuat data pesanan...
        </div>
      </AppLayout>
    );
  }

  const details = Array.isArray(order.details) ? order.details : [];

  return (
    <AppLayout breadcrumbs={[{ title: `Detail Pesanan #${order.id}`, href: `/order/${order.id}` }]}>
      <Head title={`Detail Pesanan #${order.id}`} />

      <div className="p-4 md:p-6 flex flex-col gap-6">
        
        {/* Tombol Aksi (Cetak/Kembali) */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Detail Pesanan #{order.id}
          </h1>
          <Link
            href={"/order"}
            className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Kembali
          </Link>
        </div>

        {/* === CARD INFORMASI PELANGGAN (Desain Baru) === */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Informasi Pesanan
          </h2>
          {/* Grid untuk tata letak yang rapi */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
            {/* Nama Pelanggan */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Pelanggan</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{order.customer_name}</dd>
            </div>
            {/* Telepon */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nomor HP</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{order.customer_phone}</dd>
            </div>
            {/* Tanggal Pesan */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Pesan</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(order.order_date).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}
              </dd>
            </div>
            {/* Alamat */}
            <div className="sm:col-span-3">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Alamat</dt>
              <dd className="mt-1 text-base text-gray-700 dark:text-gray-300">{order.customer_address}</dd>
            </div>
            
            <div className="sm:col-span-1"></div> {/* Spacer */}

            {/* Status Pengerjaan (Badge) */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Pengerjaan</dt>
              <dd className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.work_status, 'work')}`}>
                  {order.work_status}
                </span>
              </dd>
            </div>
            {/* Status Pembayaran (Badge) */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Pembayaran</dt>
              <dd className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.payment_status, 'payment')}`}>
                  {order.payment_status}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* === CARD DETAIL BAHAN (Tabel Modern) === */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-6 text-gray-800 dark:text-white">
            Rincian Biaya & Bahan
          </h2>
          <table className="w-full divide-y divide-gray-200 dark:divide-neutral-700">
            {/* Header Tabel */}
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item / Bahan</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Harga Satuan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            {/* Body Tabel */}
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
              {details.length > 0 ? (
                details.map((d: any) => (
                  <tr key={d.id}>
                    {/* Item */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{d.product_type}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{d.material}</div>
                    </td>
                    {/* Jumlah (Sudah bisa desimal) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                      {formatNumber(d.quantity)} <span className="text-xs text-gray-500">{d.unit || "-"}</span>
                    </td>
                    {/* Harga Satuan */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {formatRupiah(d.price)}
                    </td>
                    {/* Subtotal */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white font-mono font-medium">
                      {formatRupiah(d.subtotal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada rincian bahan untuk pesanan ini.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Footer Tabel (Total Keseluruhan) */}
            <tfoot className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white uppercase">Total Harga</td>
                <td className="px-6 py-4 text-right text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {formatRupiah(order.total_price)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>
    </AppLayout>
  );
}