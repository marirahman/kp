<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
         'order_id',
        'bank_name',    
        'account_name', 
        'amount',
        'proof_image',  
        'status',
    ];

    /**
     * Relasi ke pesanan
     */
    public function order()
    {
        return $this->belongsTo(order::class);
    }
}
