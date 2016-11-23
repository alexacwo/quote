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
        'status',
        'user_id',
        'quoted_devices',
        'devices_desc'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'quoted_devices' => 'array',
        'devices_desc' => 'array',
        'add_accessories' => 'array',
    ];

    /**
     * Get the quote request for this quote
     */
    public function quote_request()
    {
        return $this->belongsTo('App\QuoteRequest');
    }
}
