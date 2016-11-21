<?php

namespace App\Http\Controllers\Admin;

use App\User;
use App\QuoteRequest;
use App\Quote;
use App\Copier;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminController extends Controller
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
     * Show admin dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('admin.index');
    }

    /**
     * Show all quote requests
     *
     * @return \Illuminate\Http\Response
     */
    public function quote_requests()
    {
        $quote_requests = QuoteRequest::orderBy('created_at', 'asc')->get();

        return view('admin.quote_requests', [
            'quote_requests' => $quote_requests
        ]);
    }

    /**
     * Show all quotes
     *
     * @return \Illuminate\Http\Response
     */
    public function quotes()
    {
        $quotes = Quote::orderBy('created_at', 'asc')->get();

        return view('admin.quotes', [
            'quotes' => $quotes
        ]);
    }

    /**
     * Create a new quote for a given quote request
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create_quote(Request $request)
    {
        $quote_request = QuoteRequest::find($request->quote_request_id);
        $quote_request->status = 'pending';
        $quote = $quote_request->quote()->create([
            'status' => 'draft',
            'user_id' => $quote_request->user_id,
            'quoted_devices' => $quote_request->requested_devices_to_quote
        ]);
        $quote_request->quote_id = $quote->id;
        $quote_request->save();

        return redirect()->action(
            'Admin\AdminController@edit_quote', ['quote' => $quote->id]
        );
        //return view('admin.edit_quote');
    }

    /**
     * Edit the quote
     * @param  Request  $request
     * @param  string  $quote_id
     * @return \Illuminate\Http\Response
     */
    public function edit_quote(Request $request, $quote_id)
    {
        $quote = Quote::find($quote_id);

        $copier = Copier::find($quote->quoted_devices);

        if ($quote) {

            if ($quote->status == 'draft') $quote_request_status_action = 'to_be_completed';
            else $quote_request_status_action = 'save';

            return view('admin.edit_quote', [
                'quote' => $quote,
                'copier' => $copier,
                'quote_request_status_action' => $quote_request_status_action
            ]);
        }
    }

    /**
     * Make the quote published, i.e. change its status from 'draft' to 'published'
     * OR Save quote fields
     * @param  Request  $request
     * @param  string  $quote_id
     * @return \Illuminate\Http\Response
     */
    public function save_quote(Request $request)
    {
        $quote_request_status_action = $request->quote_request_status_action;
        $quote = Quote::find($request->quote_id);

         if ($quote_request_status_action == 'to_be_completed') {
            $quote->status = 'published';
            $quote->save();

            $quote_request = QuoteRequest::where('quote_id', $quote->id)->first();
            $quote_request->status = 'completed';
            $quote_request->save();

            $user = User::where('quote_request_id', $quote_request->id)->first();
            $user->quote_id = $quote->id;
            $user->save();
         }

        return view('admin.save_quote', [
            'quote_id' => $quote->id
        ]);
    }
}
