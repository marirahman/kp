<?php

namespace App\Http\Controllers;

use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RawMaterialController extends Controller
{
    // ✅ Menampilkan daftar bahan baku
    public function index()
    {
        $materials = RawMaterial::all();

        return Inertia::render('MaterialManagement', [
            'materials' => $materials,
        ]);
    }

    // ✅ Menyimpan bahan baku baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:100',
            'stock' => 'required|numeric|min:0',
            'price_per_unit' => 'required|numeric|min:0',
            'cost_per_unit' => 'required|numeric|min:0',
        ]);

        RawMaterial::create($request->all());

        return redirect()->route('materials.index')
            ->with('success', 'Bahan baku berhasil ditambahkan.');
    }

    // Untuk API list bahan
    public function list()
    {
        return response()->json(RawMaterial::all());
    }

    // ✅ Update bahan baku
    public function update(Request $request, $id)
    {
        $material = RawMaterial::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:100',
            'stock' => 'required|numeric|min:0',
            'price_per_unit' => 'required|numeric|min:0',
            'cost_per_unit' => 'required|numeric|min:0',
        ]);

        $material->update($request->all());

        return redirect()->route('materials.index')
            ->with('success', 'Data bahan baku berhasil diperbarui.');
    }

    // ✅ Hapus bahan baku
    public function destroy($id)
    {
        $material = RawMaterial::findOrFail($id);
        $material->delete();

        return redirect()->route('materials.index')
            ->with('success', 'Bahan baku berhasil dihapus.');
    }
}
