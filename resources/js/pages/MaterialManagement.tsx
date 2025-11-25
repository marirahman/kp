import React, { useState, useRef, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import toast from "react-hot-toast"; // Kita tambahkan toast untuk notifikasi

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Manajemen Stok", href: "/materials" },
];

interface Material {
  id: number;
  name: string;
  unit: string;
  stock: number;
  price_per_unit: number;
  cost_per_unit: number;
}

interface Props {
  materials: Material[];
}

export default function MaterialManagement({ materials }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // --- State Baru untuk Modal Hapus (Menggantikan confirm()) ---
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const form = useForm({
    name: "",
    unit: "",
    stock: 0,
    price_per_unit: 0,
    cost_per_unit: 0,
  });

  // --- Helper Format Angka (dari file order) ---
  const formatRupiah = (angka: number) => {
    return `Rp ${Math.round(angka).toLocaleString("id-ID")}`;
  };

  const formatNumber = (angka: number) => {
    // Format desimal jika ada, atau bulat jika tidak
    return Number(angka).toLocaleString("id-ID");
  }

  // --- Logika Submit ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && selectedId) {
      form.put(`/materials/${selectedId}`, {
        onSuccess: () => {
          resetForm();
          toast.success("Bahan baku berhasil diperbarui!");
        },
        onError: () => toast.error("Gagal memperbarui bahan baku."),
      });
    } else {
      form.post("/materials", {
        onSuccess: () => {
          form.reset();
          toast.success("Bahan baku berhasil ditambahkan!");
        },
        onError: () => toast.error("Gagal menambah bahan baku."),
      });
    }
  };

  // --- Logika Edit ---
  const handleEdit = (material: Material) => {
    setEditMode(true);
    setSelectedId(material.id);
    form.setData({
      name: material.name,
      unit: material.unit,
      stock: material.stock,
      price_per_unit: material.price_per_unit,
      cost_per_unit: material.cost_per_unit || 0,
    });
    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Logika Hapus (Modal) ---
  const openDeleteModal = (material: Material) => {
    setMaterialToDelete(material);
  };

  const closeDeleteModal = () => {
    setMaterialToDelete(null);
  };

  const confirmDelete = () => {
    if (!materialToDelete) return;
    router.delete(`/materials/${materialToDelete.id}`, {
      onSuccess: () => {
        closeDeleteModal();
        toast.success(`Bahan "${materialToDelete.name}" berhasil dihapus.`);
      },
      onError: () => {
        closeDeleteModal();
        toast.error(`Gagal menghapus "${materialToDelete.name}".`);
      },
    });
  };

  // Efek untuk fokus ke modal
  useEffect(() => {
    if (materialToDelete) {
      firstFocusableRef.current?.focus();
    }
  }, [materialToDelete]);


  const resetForm = () => {
    setEditMode(false);
    setSelectedId(null);
    form.reset();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manajemen Stok Bahan" />

      <div className="p-4 md:p-6 flex flex-col gap-6">
        
        {/* === Card Form Input (Desain Baru) === */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {editMode ? "Edit Bahan Baku" : "Tambah Bahan Baku Baru"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Input Nama */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Bahan</label>
              <input
                id="name"
                type="text"
                placeholder="Cth: Besi Holo 4x4"
                value={form.data.name}
                onChange={(e) => form.setData("name", e.target.value)}
                className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Input Satuan */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Satuan</label>
              <input
                id="unit"
                type="text"
                placeholder="Cth: Batang, Liter, Kg"
                value={form.data.unit}
                onChange={(e) => form.setData("unit", e.target.value)}
                className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Input Stok (Bisa Desimal) */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stok Saat Ini</label>
              <input
                id="stock"
                type="number"
                placeholder="Cth: 10 atau 10.5"
                value={form.data.stock}
                onChange={(e) => form.setData("stock", parseFloat(e.target.value))}
                step="0.1" // Izinkan desimal
                className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Input Harga Beli */}
            <div className="md:col-span-2">
              <label htmlFor="cost_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Harga Beli (Modal)
              </label>
              <input
                id="cost_price"
                type="number"
                placeholder="Harga beli Anda dari suplier"
                value={form.data.cost_per_unit}
                onChange={(e) => form.setData("cost_per_unit", parseFloat(e.target.value))}
                step="0.01"
                className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Input Harga (Bisa Desimal) */}
             <div className="md:col-span-2">
              <label htmlFor="sell_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Harga Jual (ke Pelanggan)
              </label>
              <input
                id="sell_price"
                type="number"
                placeholder="Harga jual ke pelanggan"
                value={form.data.price_per_unit}
                onChange={(e) => form.setData("price_per_unit", parseFloat(e.target.value))}
                step="0.01"
                className="w-full border p-2 rounded-lg dark:bg-neutral-800 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3 items-center col-span-full">
              <button
                type="submit"
                disabled={form.processing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {editMode ? "Update Bahan" : "Simpan Bahan"}
              </button>

              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 px-5 py-2 rounded-lg transition-colors"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* === Card Tabel (Desain Baru) === */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              {/* Header Tabel */}
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Bahan</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Harga Beli</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Harga Jual</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              
              {/* Body Tabel */}
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {materials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">
                      Belum ada data bahan baku.
                    </td>
                  </tr>
                ) : (
                  materials.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                      {/* Nama & Satuan */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{m.unit}</div>
                      </td>
                      {/* Stok */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`text-sm font-bold ${m.stock < 10 ? 'text-red-600' : 'text-green-600 dark:text-green-400'}`}>
                          {formatNumber(m.stock)}
                        </span>
                      </td>
                      {/* Harga Beli */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {formatRupiah(m.cost_per_unit)}
                      </td>
                      {/* Harga jual */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-800 dark:text-gray-200 font-mono">
                        {formatRupiah(m.price_per_unit)}
                      </td>
                      {/* Aksi (Edit/Hapus) */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => handleEdit(m)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteModal(m)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Hapus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
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

      {/* === Modal Hapus (Desain Baru) === */}
      {materialToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Konfirmasi Hapus
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Anda yakin ingin menghapus bahan <strong>{materialToDelete.name}</strong>? Stok yang ada akan hilang permanen.
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