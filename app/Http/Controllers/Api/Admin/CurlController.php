<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;

class CurlController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Send curl request
     * @param url
     * @param username:password
     * @return void
     */
    public function get($url, $username, $password) {

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
        curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
        $curl_response = curl_exec($ch);
        if( $curl_response === false)
        {
            $res = curl_error($ch);
        }
        else
        {
            $res = $curl_response;
        }

        curl_close($ch);

        return $res;
    }

}
