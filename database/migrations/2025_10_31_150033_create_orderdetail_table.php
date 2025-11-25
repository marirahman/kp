<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('product_type'); // contoh: pagar, kanopi, tralis
            $table->string('material'); // contoh: besi holo, pipa
            $table->string('size'); // contoh: 3x4 meter
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();

            // relasi
            $table->foreign('order_id')->references('id')->on('order')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
