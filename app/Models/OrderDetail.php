<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_type',
        'material',
        'size',
        'quantity',
        'price',
        'subtotal',
    ];

    /**
     * Relasi ke pesanan induk
     */
    public function order()
    {
        return $this->belongsTo(order::class);
    }

    public function material()
    {
    return $this->belongsTo(RawMaterial::class, 'material', 'id');
    }       
}
