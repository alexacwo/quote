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
        'quoted_devices'
    ];

    /**
     * Get the quote request for this quote
     */
    public function quote_request()
    {
        return $this->belongsTo('App\QuoteRequest');
    }
}
