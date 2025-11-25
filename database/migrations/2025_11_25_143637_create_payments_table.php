<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            
            // --- PERBAIKAN DI SINI ---
            // Ganti constrained('orders') menjadi constrained('order')
            // Karena nama tabel di database kamu adalah 'order'
            $table->foreignId('order_id')->constrained('order')->onDelete('cascade');
            
            $table->string('bank_name'); 
            $table->string('account_name'); 
            $table->decimal('amount', 15, 2); 
            $table->string('proof_image'); 
            $table->string('status')->default('pending'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};