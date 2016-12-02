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
        'link_guid',
        'publish_status',
        'user_id',
        'devices',
        'devices_desc',
        'prices'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'devices' => 'array',
        'devices_desc' => 'array',
        'added_accessories' => 'array',
        'selected_accessories' => 'array',
        'prices' => 'array',
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

