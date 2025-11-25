<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionUsage extends Model
{
     protected $fillable = ['order_id', 'raw_material_id', 'quantity_used', 'cost_used'];

    public function material()
    {
        return $this->belongsTo(RawMaterial::class, 'raw_material_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
