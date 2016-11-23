<?php

namespace App\Http\Controllers\Client;

use App\Device;
use App\Accessory;
use App\User;
use App\QuoteRequest;
use App\Quote;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ClientController extends Controller
{
    /**
     * Show client index page.
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        /*$accessory = new Accessory;
        $accessory->title = 'WorkCentre 7855 Addl 21 M';
        $accessory->part_number = 'E7855S2P';
        $accessory->cost = 100;
        $accessory->price = 150;
        $accessory->save();*/

        return view('client.index', [
            'request' => $request
        ]);
    }

    /**
     * Page for creating quote request
     *
     * @return \Illuminate\Http\Response
     */
    public function quote_request()
    {
        $devices = Device::orderBy('created_at', 'asc')->get();

        return view('client.quote_request', [
            'devices' => $devices
        ]);
    }

    /**
     * View published quote
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function view_quote(Request $request, $quote_id)
    {
        $accessories_for_devices = array();

        $quote = Quote::find($quote_id);
        $quoted_devices = Device::find($quote->quoted_devices);
        foreach ($quote->add_accessories as $device_id => $accessories) {
            $where = array_values($quote->add_accessories[$device_id]);
            $accessories_for_devices[$device_id] = Accessory::find($where);
        }

        if ($quote && $quote->status == 'published') {

            return view('client.view_quote', [
                'quote' => $quote,
                'quoted_devices' => $quoted_devices,
                'accessories_for_devices' => $accessories_for_devices
            ]);
        }
    }

    /**
     * Create a new quote request.
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create_quote_request(Request $request)
    {
        $this->validate($request, [
            'devices_to_quote' => 'required',
            'email' => 'required'
        ]);

        $user = new User;
        $user->role = 'user';
        $user->name = 'John';
        $user->email = $request->email;
        $password = str_random(6);
        $user->password = bcrypt($password);
        $user->unencrypt = $password;
        $user->save();

        $quote_request = new QuoteRequest;
        $quote_request->requested_devices_to_quote = $request->devices_to_quote;
        $quote_request->email = $request->email;
        $quote_request->status = 'created';
        $quote_request->user_id = $user->id;
        $quote_request->save();

        $user->quote_request_id = $quote_request->id;
        $user->save();

        return view('client.request_created');
    }

}