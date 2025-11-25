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
    Schema::create('production_usages', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained('order')->onDelete('cascade');
        $table->foreignId('raw_material_id')->constrained('raw_materials')->onDelete('cascade');
        $table->decimal('quantity_used', 10, 2);
        $table->decimal('cost_used', 12, 2);
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('production_usages');
    }
};
