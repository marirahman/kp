<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
     use HasFactory;

    protected $table = 'order'; // sesuai nama tabel kamu
    protected $fillable = [
        'customer_name',
        'customer_phone',
        'customer_address',
        'order_date',
        'payment_status',
        'work_status',
        'total_price',
        'total_cost',
    ];

    /**
     * Relasi ke detail pesanan
     * Satu pesanan bisa memiliki banyak item (order detail)
     */
    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }

    /**
     * Relasi ke pembayaran
     * Satu pesanan bisa memiliki banyak pembayaran (DP dan Pelunasan)
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Helper untuk mengambil pembayaran terakhir
    public function getLatestPaymentAttribute()
    {
        return $this->payments()->latest()->first();
    }

    /**
     * Hitung total pembayaran yang sudah masuk
     */
    public function getTotalPaidAttribute()
    {
        return $this->payments->sum('amount');
    }

    /**
     * Hitung sisa pembayaran
     */
    public function getRemainingPaymentAttribute()
    {
        return $this->total_price - $this->total_paid;
    }
}
