<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Menambahkan kolom "Harga Beli/Modal" ke tabel bahan
        Schema::table('raw_materials', function (Blueprint $table) {
            $table->decimal('cost_per_unit', 15, 2) // Harga Beli / Modal
                  ->default(0)
                  ->after('price_per_unit'); // Letakkan setelah Harga Jual
        });

        // 2. Menambahkan kolom "Total Modal" ke tabel pesanan
        Schema::table('order', function (Blueprint $table) {
            $table->decimal('total_cost', 15, 2) // Total Modal (Cost)
                  ->default(0)
                  ->after('total_price'); // Letakkan setelah Total Jual (Price)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Ini untuk rollback (jika terjadi kesalahan)
        Schema::table('raw_materials', function (Blueprint $table) {
            $table->dropColumn('cost_per_unit');
        });

        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn('total_cost');
        });
    }
};