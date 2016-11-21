<?php

namespace App\Http\Controllers\Client;

use App\Copier;
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
       /* $copier = new Copier;
        $copier->make = 'Xerox';
        $copier->model = 'Phaser 6600';
        $copier->cost = 100;
        $copier->price = 150;
        $copier->speed = 22;
        $copier->paper_size = 'letter/legal';
        $copier->color_or_mono = 'mono';
        $copier->device_type = 'printer';
        $copier->image = 'http://www';
        $copier->pdf = 'http://wwww';
        $copier->save();*/

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
        $copiers = Copier::orderBy('created_at', 'asc')->get();

        return view('client.quote_request', [
            'copiers' => $copiers
        ]);
    }

    /**
     * View published quote
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function view_quote(Request $request, $quote_id)
    {
        $quote = Quote::find($quote_id);

        if ($quote && $quote->status == 'published') {

            return view('client.view_quote', [
                'quote' => $quote
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

