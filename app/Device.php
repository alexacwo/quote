<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'make',
        'model',
        'cost',
        'price',
        'speed',
        'paper_size',
        'color_or_mono',
        'device_type',
        'maintenance',
        'cost_per_color_page',
        'cost_per_mono_page',
        'rebates',
        'image',
        'pdf',
        'ced',
        'created_by'
    ];

    /**
     * Get quotes which included this device
     */
    public function quotes()
    {
        return $this->belongsToMany('App\Quote');
    }

    /**
     * Get accessories that are assigned to this device
     */
    public function accessories()
    {
        return $this->belongsToMany('App\Accessory');
    }
}
