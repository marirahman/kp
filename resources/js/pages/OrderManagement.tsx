import { useState, useEffect, useRef } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import toast from "react-hot-toast";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Pesanan", href: "/order" }];

// --- TIPE DATA ---
type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  work_status: string;
  payment_status: string;
  order_date?: string;
  total_price?: number;
  details: { product_type: string; material: string; quantity: number }[];
};

type Material = {
  id: number;
  name: string;
  unit: string;
  stock: number;
  price_per_unit: number;
};

type Props = {
  orders: Order[];
  materials: Material[];
};

type UsedMaterialItem = {
  raw_material_id: string;
  quantity_used: string;
};

export default function OrderManagement({ orders, materials }: Props) {
  // === STATE FORM UTAMA ===
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [workStatus, setWorkStatus] = useState("Menunggu");
  const [paymentStatus, setPaymentStatus] = useState("Belum Bayar");
  const [orderDate, setOrderDate] = useState("");
  
  // State Harga
  const [totalPriceManual, setTotalPriceManual] = useState(""); // Input manual
  const [totalCalculated, setTotalCalculated] = useState(0);    // Hasil hitungan otomatis

  const [productType, setProductType] = useState("");
  const [usedMaterials, setUsedMaterials] = useState<UsedMaterialItem[]>([
    { raw_material_id: "", quantity_used: "" }
  ]);

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const { errors } = usePage().props;
  const generalError = (errors as any)?.general;

  // === EFEK: HITUNG TOTAL OTOMATIS ===
  useEffect(() => {
    let total = 0;
    usedMaterials.forEach(item => {
      const mat = materials.find(m => m.id === Number(item.raw_material_id));
      const qty = parseFloat(item.quantity_used) || 0;
      if (mat && qty > 0) {
        total += mat.price_per_unit * qty;
      }
    });
    setTotalCalculated(total);
  }, [usedMaterials, materials]);

  // === FUNGSI FORMAT RUPIAH (TANPA ,00) ===
  const formatRupiah = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "Rp 0";
    return "Rp " + Math.round(num).toLocaleString("id-ID");
  };

  // === FUNGSI FORMAT ANGKA (UNTUK STOK) ===
  const formatNumber = (num: number) => {
    return Number(num).toLocaleString("id-ID");
  }

  // === HANDLER BAHAN (RESET HARGA MANUAL) ===
  const addMaterial = () => {
    setUsedMaterials([...usedMaterials, { raw_material_id: "", quantity_used: "" }]);
    setTotalPriceManual(""); // Reset manual price saat tambah bahan
  };

  const removeMaterial = (index: number) => {
    setUsedMaterials(usedMaterials.filter((_, i) => i !== index));
    setTotalPriceManual(""); // Reset manual price saat hapus bahan
  };

  const handleMaterialChange = (index: number, field: string, value: string) => {
    const newMaterials = [...usedMaterials];
    (newMaterials[index] as any)[field] = value;
    setUsedMaterials(newMaterials);
    setTotalPriceManual(""); // Reset manual price saat ubah bahan
  };

  // === FUNGSI EDIT (LOAD DATA KE FORM) ===
  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setCustomerName(order.customer_name);
    setCustomerPhone(order.customer_phone);
    setCustomerAddress(order.customer_address);
    setWorkStatus(order.work_status);
    setPaymentStatus(order.payment_status);
    setOrderDate(order.order_date || "");
    setTotalPriceManual(order.total_price ? order.total_price.toString() : "");
    setProductType(order.details[0]?.product_type || "");

    const loadedMaterials = order.details.map((detail) => {
      const mat = materials.find((m) => m.name === detail.material);
      return {
        raw_material_id: mat ? String(mat.id) : "",
        quantity_used: String(detail.quantity),
      };
    });
    setUsedMaterials(loadedMaterials.length > 0 ? loadedMaterials : [{ raw_material_id: "", quantity_used: "" }]);
    
    // Scroll ke atas agar form edit terlihat
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // === FUNGSI SUBMIT (TAMBAH & UPDATE) ===
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);

    const finalPrice = totalPriceManual.trim() !== "" ? parseFloat(totalPriceManual) : totalCalculated;

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      work_status: workStatus,
      payment_status: paymentStatus,
      order_date: orderDate,
      total_price: finalPrice,
      product_type: productType,
      details: usedMaterials.map((m) => ({
        raw_material_id: Number(m.raw_material_id),
        quantity_used: parseFloat(m.quantity_used), // Desimal aman
      })).filter(m => m.raw_material_id && m.quantity_used > 0),
    };

    const options = {
      onSuccess: () => {
        toast.success(editingOrder ? "Pesanan diperbarui" : "Pesanan ditambahkan");
        resetForm();
        router.reload({ only: ['orders'] }); // <-- Penting untuk refresh tabel
      },
      onError: (err: any) => toast.error(err.general || "Gagal menyimpan"),
    };

    if (editingOrder) {
      router.put(`/order/${editingOrder.id}`, payload, options);
    } else {
      router.post("/order", payload, options);
    }
  };

  // === FUNGSI RESET FORM ===
  const resetForm = () => {
    setEditingOrder(null);
    setCustomerName(""); setCustomerPhone(""); setCustomerAddress("");
    setWorkStatus("Menunggu"); setPaymentStatus("Belum Bayar"); setOrderDate("");
    setTotalPriceManual(""); setTotalCalculated(0);
    setProductType("");
    setUsedMaterials([{ raw_material_id: "", quantity_used: "" }]);
  };

  // === FUNGSI DELETE (MODAL) ===
  const confirmDelete = () => {
    if (!deleteId) return;
    router.delete(`/order/${deleteId}`, {
      onSuccess: () => { 
        toast.success("Pesanan dihapus"); 
        setDeleteId(null); 
      },
      onError: () => toast.error("Gagal menghapus pesanan"),
    });
  };

  const openDeleteModal = (id: number) => setDeleteId(id);
  const closeDeleteModal = () => setDeleteId(null);

  useEffect(() => {
    if (deleteId) firstFocusableRef.current?.focus();
  }, [deleteId]);

  // === FUNGSI HELPER TAMPILAN (BADGE STATUS) ===
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Diproses':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Menunggu':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // === RENDER ===
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={editingOrder ? "Edit Pesanan" : "Manajemen Pesanan"} />
      
      <div className="p-4 md:p-6 flex flex-col gap-6">
        
        {/* PESAN ERROR GLOBAL (cth: STOK HABIS) */}
        {generalError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{generalError}</p>
          </div>
        )}

        {/* === CARD FORM INPUT (DESAIN MODERN) === */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white">
            {editingOrder ? `Edit Pesanan #${editingOrder.id}` : "Buat Pesanan Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* --- Data Pelanggan --- */}
            <div className="col-span-6 md:col-span-2">
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Pelanggan</label>
              <input id="customer_name" type="text" placeholder="Nama..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:border-neutral-700" required />
            </div>
            <div className="col-span-6 md:col-span-2">
              <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nomor HP</label>
              <input id="customer_phone" type="text" placeholder="08..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:border-neutral-700" required />
            </div>
            <div className="col-span-6 md:col-span-2">
              <label htmlFor="customer_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat</label>
              <input id="customer_address" type="text" placeholder="Alamat..." value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:border-neutral-700" required />
            </div>
            
            {/* --- Data Pesanan --- */}
            <div className="col-span-6 md:col-span-2">
              <label htmlFor="order_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal Pesan</label>
              <input id="order_date" type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:border-neutral-700" required />
            </div>
            <div className="col-span-3 md:col-span-2">
              <label htmlFor="work_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Pengerjaan</label>
              <select id="work_status" value={workStatus} onChange={e => setWorkStatus(e.target.value)} className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
                <option value="Menunggu">Menunggu</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className="col-span-3 md:col-span-2">
              <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Pembayaran</label>
              <select id="payment_status" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:border-neutral-700">
                <option value="Belum Bayar">Belum Bayar</option>
                <option value="DP">Sudah DP</option>
                <option value="Lunas">Lunas</option>
              </select>
            </div>

            {/* --- Data Produk & Harga --- */}
            <div className="col-span-6 md:col-span-3">
              {/* === PERBAIKAN TYPO DI SINI === */}
              <label htmlFor="product_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis Produk</label>
              <input 
                id="product_type"
                placeholder="Cth: Pagar Minimalis, Kanopi" 
                value={productType} 
                onChange={e => setProductType(e.target.value)} 
                className="border p-2 rounded-lg w-full bg-blue-50 dark:bg-neutral-800 dark:border-neutral-700 font-semibold" 
                required 
              />
            </div>
            <div className="col-span-6 md:col-span-3">
              <label htmlFor="total_manual" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Manual (Opsional)</label>
              <input 
                id="total_manual"
                type="number" 
                placeholder={`Otomatis: ${formatRupiah(totalCalculated)}`}
                value={totalPriceManual} 
                onChange={e => setTotalPriceManual(e.target.value)} 
                className="border p-2 rounded-lg w-full dark:bg-neutral-800 dark:border-neutral-700" 
              />
            </div>

            {/* --- BAHAN BAKU (LOOPING) --- */}
            <div className="col-span-6 border-t dark:border-neutral-700 pt-4 mt-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">Bahan Baku yang Digunakan</h3>
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  Total Terhitung: {formatRupiah(totalCalculated)}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {usedMaterials.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                    <div className="col-span-12 sm:col-span-7">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Bahan</label>
                      <select value={item.raw_material_id} onChange={e => handleMaterialChange(i, 'raw_material_id', e.target.value)} className="w-full border p-2 rounded-lg dark:bg-neutral-700 dark:border-neutral-600" required>
                        <option value="">-- Pilih Bahan --</option>
                        {materials.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} (Stok: {formatNumber(m.stock)}) @{formatRupiah(m.price_per_unit)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Jumlah</label>
                      <input 
                        type="number" 
                        placeholder="Jml" 
                        value={item.quantity_used} 
                        onChange={e => handleMaterialChange(i, 'quantity_used', e.target.value)} 
                        className="w-full border p-2 rounded-lg dark:bg-neutral-700 dark:border-neutral-600" 
                        required 
                        step="0.1"
                        min="0.1"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-2 flex items-end h-full">
                      {usedMaterials.length > 1 ? (
                        <button type="button" onClick={() => removeMaterial(i)} className="text-red-500 hover:text-red-700 font-bold p-2 rounded-lg w-full bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800">
                          Hapus
                        </button>
                      ) : (
                        <div className="w-full p-2 h-10"></div> // Placeholder agar sejajar
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addMaterial} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-3 text-sm transition-colors">
                + Tambah Bahan
              </button>
            </div>

            {/* --- Tombol Aksi Form --- */}
            <div className="col-span-6 flex gap-3 mt-4 border-t dark:border-neutral-700 pt-4">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                {editingOrder ? "Update Pesanan" : "Simpan Pesanan"}
              </button>
              {editingOrder && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* === CARD TABEL PESANAN (DESAIN MODERN) === */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pelanggan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500 dark:text-gray-400">
                      Belum ada pesanan.
                    </td>
                  </tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                      {/* Pelanggan */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{o.customer_name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">#{o.id} / {o.customer_phone}</div>
                      </td>
                      {/* Tanggal */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {o.order_date ? new Date(o.order_date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric'}) : "-"}
                      </td>
                      {/* Status (Badge) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(o.work_status)}`}>
                          {o.work_status}
                        </span>
                      </td>
                      {/* Total */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-mono text-gray-900 dark:text-white">
                        {formatRupiah(o.total_price || 0)}
                      </td>
                      {/* Aksi (Ikon) */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-4">
                          <button onClick={() => router.visit(`/order/${o.id}`)} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" title="Detail">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                          </button>
                          <button onClick={() => handleEdit(o)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                          </button>
                          <button onClick={() => openDeleteModal(o.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" title="Hapus">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* === MODAL DELETE (DESAIN BARU) === */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={closeDeleteModal}>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Konfirmasi Hapus
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Anda yakin ingin menghapus pesanan ini? Stok bahan yang sudah terpakai akan dikembalikan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                ref={firstFocusableRef}
                onClick={closeDeleteModal}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
    );
}
