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
         // Pastikan nama tabelnya sesuai database kamu ('orders' atau 'order')
        // Cek model Order.php kamu protected $table = '...';
        $tableName = 'order'; 
        if (!Schema::hasTable('order') && Schema::hasTable('order')) {
            $tableName = 'order';
        }

        Schema::table($tableName, function (Blueprint $table) {
            // Ubah kolom menjadi string (VARCHAR 255) agar muat teks panjang
            $table->string('payment_status', 255)->change();
            // Jaga-jaga ubah work_status juga
            $table->string('work_status', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
