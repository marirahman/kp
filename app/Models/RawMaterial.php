<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{

    protected $table = 'raw_materials';
    protected $fillable = ['name', 'unit', 'stock', 'price_per_unit', 'cost_per_unit'];

    public function usages()
    {
        return $this->hasMany(ProductionUsage::class);
    }
}
