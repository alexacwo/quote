<?php

namespace App\Http\Controllers;

use App\QuoteRequest;
use Illuminate\Http\Request;

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
        die();return view('admin.index');
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
     * Create a new quote for a given quote request
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create_quote(Request $request)
    {
        $quote_request = QuoteRequest::find($request->quote_request_id);
        $quote_request->status = 'pending';
        $quote_request->save();

        $quote = new Quote;
        $quote->status = 'draft';
        $quote->save();

        return view('admin.prepare_quote');
    }
}
