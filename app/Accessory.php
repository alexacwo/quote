<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Accessory extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'accessories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'part_number',
        'description',
        'cost',
        'price'
    ];
}
