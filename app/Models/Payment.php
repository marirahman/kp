<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_date',
        'amount',
        'payment_type',
        'proof',
    ];

    /**
     * Relasi ke pesanan
     */
    public function order()
    {
        return $this->belongsTo(order::class);
    }
}
