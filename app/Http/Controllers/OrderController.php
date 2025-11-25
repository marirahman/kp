<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    // ✅ Daftar Pesanan
    public function index()
    {
        $orders = Order::with('details')->orderBy('created_at', 'desc')->get();
        $materials = RawMaterial::all();
        
        return Inertia::render('OrderManagement', [
            'orders' => $orders, 
            'materials' => $materials
        ]);
    }

    // ✅ Simpan Pesanan Baru
    public function store(Request $request)
    {
        // 1. Validasi Input
        $val = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:255',
            'work_status' => 'required|string',
            'payment_status' => 'required|string',
            'order_date' => 'required|date',
            'total_price' => 'nullable|numeric', 
            'product_type' => 'required|string',
            
            'details' => 'nullable|array',
            'details.*.raw_material_id' => 'required|exists:raw_materials,id',
            'details.*.quantity_used' => 'required|numeric|min:0.1',
        ]);

        // Pastikan total_price tidak null (default 0)
        $val['total_price'] = $val['total_price'] ?? 0;

        try {
            DB::transaction(function () use ($val) {
                
                // 2. Buat Order Utama
                // Harga langsung disimpan dari kiriman Frontend
                $order = Order::create($val); 

                $calculatedCost = 0;
                
                // 3. Proses Detail Bahan (Jika ada)
                if (!empty($val['details'])) {
                    foreach ($val['details'] as $d) {
                        $mat = RawMaterial::find($d['raw_material_id']);

                        // Cek Stok
                        if ($mat->stock < $d['quantity_used']) {
                            throw new \Exception("Stok {$mat->name} tidak cukup (Sisa: {$mat->stock}).");
                        }

                        // Kurangi Stok
                        $mat->decrement('stock', $d['quantity_used']);
                        
                        // Hitung Subtotal untuk data detail
                        $sub_price = $mat->price_per_unit * $d['quantity_used'];

                        // Hitung Subtotal Modal ---
                        $sub_cost = $mat->cost_per_unit * $d['quantity_used'];
                        $calculatedCost += $sub_cost; // Tambahkan ke total modal
                        
                        // Simpan Detail
                        OrderDetail::create([
                            'order_id' => $order->id,
                            'product_type' => $val['product_type'],
                            'material' => $mat->name,
                            'size' => '-', 
                            'quantity' => $d['quantity_used'],
                            'price' => $mat->price_per_unit, 
                            'subtotal' => $sub_price,    
                        ]);
                    }
                }
                $order->update(['total_cost' => $calculatedCost]);
            });
        } catch (\Exception $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }

        return redirect()->route('order.index')->with('success', 'Pesanan berhasil ditambahkan.');
    }

    // ✅ Update Pesanan
    public function update(Request $request, $id)
    {
        $val = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:255',
            'work_status' => 'required|string',
            'payment_status' => 'required|string',
            'order_date' => 'required|date',
            'total_price' => 'nullable|numeric',
            'product_type' => 'required|string',
            
            'details' => 'nullable|array',
            'details.*.raw_material_id' => 'required|exists:raw_materials,id',
            'details.*.quantity_used' => 'required|numeric|min:0.1',
        ]);

        $val['total_price'] = $val['total_price'] ?? 0;

        try {
            DB::transaction(function () use ($val, $id) {
                $order = Order::with('details')->findOrFail($id);
                
                // 1. Kembalikan Stok Lama (Reset sebelum update)
                foreach ($order->details as $old) {
                    RawMaterial::where('name', $old->material)->increment('stock', $old->quantity);
                }
                // Hapus detail lama
                $order->details()->delete();

                // 2. Update Data Utama Order
                // Harga langsung disimpan dari kiriman Frontend
                $order->update($val);

                $calculatedCost = 0;

                // 3. Proses Detail Baru
                if (!empty($val['details'])) {
                    foreach ($val['details'] as $d) {
                        $mat = RawMaterial::find($d['raw_material_id']);

                        // Cek Stok Baru
                        if ($mat->stock < $d['quantity_used']) {
                            throw new \Exception("Stok {$mat->name} kurang untuk update ini (Sisa: {$mat->stock}).");
                        }

                        $mat->decrement('stock', $d['quantity_used']);
                        $sub_price = $mat->price_per_unit * $d['quantity_used'];

                        // Hitung Subtotal Modal ---
                        $sub_cost = $mat->cost_per_unit * $d['quantity_used'];
                        $calculatedCost += $sub_cost; // Tambahkan ke total modal

                        OrderDetail::create([
                            'order_id' => $order->id,
                            'product_type' => $val['product_type'],
                            'material' => $mat->name,
                            'size' => '-', 
                            'quantity' => $d['quantity_used'],
                            'price' => $mat->price_per_unit, 
                            'subtotal' => $sub_price, 
                        ]);
                    }
                }
                $order->update(['total_cost' => $calculatedCost]);
            });
        } catch (\Exception $e) {
            return back()->withErrors(['general' => $e->getMessage()]);
        }

        return redirect()->route('order.index')->with('success', 'Pesanan berhasil diperbarui.');
    }

    // ✅ Hapus Pesanan
    public function destroy($id) 
    {
        $order = Order::with('details')->findOrFail($id);
        try {
            DB::transaction(function () use ($order) {
                // Kembalikan stok saat menghapus pesanan
                foreach ($order->details as $detail) {
                    RawMaterial::where('name', $detail->material)->increment('stock', $detail->quantity);
                }
                $order->delete(); 
            });
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Gagal hapus: ' . $e->getMessage()]);
        }
        return redirect()->route('order.index')->with('success', 'Pesanan dihapus & stok dikembalikan.');
    }
    
    // ✅ Detail Pesanan (View)
    public function show($id) 
    {
        $order = Order::with('details')->findOrFail($id);
        
        // Ambil satuan (unit) bahan untuk ditampilkan di view
        $mats = RawMaterial::all()->keyBy('name');
        foreach($order->details as $d) {
            $matInfo = $mats->get($d->material);
            $d->unit = $matInfo ? $matInfo->unit : '-';
        }
        
        return Inertia::render('OrderDetailView', ['order' => $order]);
    }
}