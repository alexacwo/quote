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
        'image',
        'pdf'
    ];

}
