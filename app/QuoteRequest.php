<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'copier',
        'email',
        'status',
        'requested_devices_to_quote'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'requested_devices_to_quote' => 'array'
    ];

    /**
     * Get the quote associated with this quote request.
     */
    public function quote()
    {
        return $this->hasOne('App\Quote');
    }

    /**
     * Get the user that submitted quote request
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
