<?php

namespace App\Http\Controllers;

use App\User;
use App\QuoteRequest;
use App\Quote;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Show client index page.
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return view('client.index', [
            'request' => $request
        ]);
    }

    /**
     * Create a new quote request.
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create_quote_request(Request $request)
    {
        $this->validate($request, [
            'copier' => 'required',
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
        $quote_request->copier = $request->copier;
        $quote_request->email = $request->email;
        $quote_request->status = 'created';
        $quote_request->user_id = $user->id;
        $quote_request->save();

        $user->quote_request_id = $quote_request->id;
        $user->save();

        return view('client.request_created');
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
}

