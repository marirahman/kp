import React, { JSX } from 'react'; 
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react'; // <-- Import yang benar (ada 'Link')
import { type BreadcrumbItem } from '@/types'; // <-- Hanya satu kali import
// --- TAMBAHKAN 2 BARIS INI ---
import { type SharedData } from '@/types'; // (Untuk auth, ziggy, dll)
import { route } from 'ziggy-js'; // (Untuk link ke halaman stok)
// --- SELESAI ---

// --- TIPE DATA PROPS ---
interface StatCards {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalOrders: number;
}

interface RecentOrder {
  id: number;
  customer_name: string;
  total_price: number;
  total_cost: number;
  profit: number;
}

interface LowStockItem {
  id: number;
  name: string;
  stock: number;
  unit: string;
}

interface Props extends SharedData {
  stats: StatCards;
  recentOrders: RecentOrder[];
  lowStockItems: LowStockItem[];
}
// --- AKHIR TIPE DATA ---

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// === Helper Format Rupiah (Tanpa ,00) ===
const formatRupiah = (num: number | null | undefined) => {
  if (num === null || num === undefined) return "Rp 0";
  return "Rp " + Math.round(num).toLocaleString("id-ID");
};

// === Helper Format Angka Biasa ===
const formatNumber = (num: number | null | undefined) => {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString("id-ID");
};


// === Komponen Kecil untuk Kartu Statistik ===
interface StatCardProps {
  title: string;
  value: string;
  icon: JSX.Element;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
  <div className={`bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-5 flex items-center gap-4 border-l-4 ${colorClass}`}>
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
      <dd className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</dd>
    </div>
  </div>
);


// === KOMPONEN UTAMA DASHBOARD ===
// Kita terima 'props' secara keseluruhan
export default function Dashboard(props: Props) { 
    
    // Ambil data yang kita butuhkan dari 'props'
    const { stats, recentOrders, lowStockItems } = props;

    // Ikon untuk Kartu Statistik
    const icons = {
      revenue: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182S13.53 8.34 12.359 9.22l-.879.659M7.5 14.25l6-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
      cost: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.M1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75-.75v-.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V4.5m1.5-1.5v.75c0 .414-.336.75-.75.75H3a.75.75 0 0 1-.75-.75V4.5m0 0h1.125c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H3.375m1.5-1.5H3" /></svg>,
      profit: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28a11.95 11.95 0 0 0-5.814 5.518l-4.306-4.306L2.25 18Z" /></svg>,
      orders: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>,
    };

    // Fallback jika props belum terload
    const safeStats = stats || { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalOrders: 0 };
    const safeRecentOrders = recentOrders || [];
    const safeLowStockItems = lowStockItems || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4 md:p-6 flex flex-col gap-6">
                
                {/* --- KARTU STATISTIK (FITUR d) --- */}
                <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <StatCard 
                    title="Total Pendapatan" 
                    value={formatRupiah(safeStats.totalRevenue)} 
                    icon={icons.revenue} 
                    colorClass="border-green-500 text-green-600"
                  />
                  <StatCard 
                    title="Total Modal (HPP)" 
                    value={formatRupiah(safeStats.totalCost)} 
                    icon={icons.cost} 
                    colorClass="border-red-500 text-red-600"
                  />
                  <StatCard 
                    title="Total Keuntungan" 
                    value={formatRupiah(safeStats.totalProfit)} 
                    icon={icons.profit} 
                    colorClass="border-blue-500 text-blue-600"
                  />
                  <StatCard 
                    title="Jumlah Pesanan" 
                    value={formatNumber(safeStats.totalOrders)} 
                    icon={icons.orders} 
                    colorClass="border-gray-500 text-gray-600"
                  />
                </dl>

                {/* --- LAPORAN (FITUR e) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* --- LAPORAN PROFIT PER PESANAN --- */}
                  <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg lg:col-span-2">
                    <h3 className="text-lg font-semibold p-4 border-b dark:border-neutral-700">5 Pesanan Terbaru</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pelanggan</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pendapatan</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modal</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Keuntungan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                          {safeRecentOrders.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">Belum ada pesanan.</td></tr>
                          ) : (
                            safeRecentOrders.map(order => (
                              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                <td className="p-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customer_name}</div>
                                  <div className="text-xs text-gray-500">ID: #{order.id}</div>
                                </td>
                                <td className="p-4 whitespace-nowrap text-right font-mono text-green-600">{formatRupiah(order.total_price)}</td>
                                <td className="p-4 whitespace-nowrap text-right font-mono text-red-600">{formatRupiah(order.total_cost)}</td>
                                <td className="p-4 whitespace-nowrap text-right font-mono font-bold text-blue-600">{formatRupiah(order.profit)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* --- LAPORAN STOK KRITIS --- */}
                  <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold p-4 border-b dark:border-neutral-700">Laporan Stok Kritis</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Bahan</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sisa Stok</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                          {safeLowStockItems.length === 0 ? (
                            <tr><td colSpan={2} className="p-4 text-center text-gray-500 dark:text-gray-400">Stok aman!</td></tr>
                          ) : (
                            safeLowStockItems.map(item => (
                              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                                <td className="p-4 whitespace-nowrap text-right font-bold text-red-600">
                                  {formatNumber(item.stock)} <span className="text-xs text-gray-500">{item.unit}</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t dark:border-neutral-700">
                        <Link href={route('materials.index')} className="text-sm font-medium text-blue-600 hover:underline">
                          Pergi ke Manajemen Stok &rarr;
                        </Link>
                    </div>
                  </div>

                </div>
            </div>
        </AppLayout>
    );
}