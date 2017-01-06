<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'guid',
        'editor',
        'status',
        'user_id',
        'devices',
        'devices_desc',
        'prices',
        'custom_accessories',
        'custom_descriptions',
		'how_did_we_do',
		'sum_up',
		'rates_options',
		'no_of_views',
		'last_view',
		'allowed_prices'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'devices' => 'array',
        'added_accessories' => 'array',
        'selected_accessories' => 'array',
        'prices' => 'array',
		
        'devices_desc' => 'array',
        'custom_accessories' => 'array',
        'custom_descriptions' => 'array',
        'included_pages' => 'array',
		
        'selected_custom_accessories' => 'array',
        'how_did_we_do' => 'array',
        'rates_options' => 'array',
        'allowed_prices' => 'array',
    ];

    /**
     * Get the user for whom this quote was prepared
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    /**
     * Get the quoted devices
     */
    public function devices()
    {
        return $this->belongsToMany('App\Device');
    }
}

