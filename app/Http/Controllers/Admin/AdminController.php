<?php

namespace App\Http\Controllers\Admin;

use DB;

use App\User;
use App\QuoteRequest;
use App\Quote;
use App\Device;
use App\Accessory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Admin\CurlController;

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
		return view('admin.angular');
    }

    /**
     * Angular admin front-end
     *
     * @return \Illuminate\Http\Response
     */
    public function angular()
    {
        return view('admin.angular');
    }

    /**
     * Show all users for whom quotes were prepared
     *
     * @return \Illuminate\Http\Response
     */
    public function users()
    {
        $users = User::orderby('id')->where('role', '<>', 'admin')->get();

        return view('admin.users', [
            'users' => $users
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
     * Generate a new string and check (though it is very unlikely) if it exists in the database
     *
     * @return \Illuminate\Http\Response
     */
    public function generate_guid_for_quote_link() {
        $guid = str_random(20);
        $quote = Quote::where('guid', $guid)->first();

        return ($quote === null) ? $guid : $this->generate_guid();
    }

    /**
     * Create a new quote for a given quote request
     * @param  Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create_quote(Request $request)
    {
        $guid = $this->generate_guid_for_quote_link();

        $quote = new Quote;
        $quote->guid = $guid;
        $quote->status = 'draft';
        $quote->save();

        return redirect('/admin/quote/' . $quote->guid);
    }

    /**
     * Edit the quote
     * @param  Request  $request
     * @param  string  $quote_id
     * @return \Illuminate\Http\Response
     */
    public function edit_quote(Request $request, $quote_guid)
    {
        $quote = Quote::where('guid', $quote_guid)->first();

        $curl = new CurlController;
        $url = "https://pahoda.capsulecrm.com/api/party";
        $username = "108fa7bce4476acba87cd36f699b2df9";
        $password = "x";
        $json_response = $curl->get($url, $username, $password);
        $response = json_decode($json_response);

        $contacts = $response->parties->person;

        $accessories = Accessory::orderBy('part_number', 'asc')->get();
 
        return view('admin.edit_quote', [
            'quote' => $quote,
            'contacts' => $contacts,
            'accessories' => $accessories,
        ]);
    }

    /**
     * Get the list of devices for a quote
     *
     * @return \Illuminate\Http\Response
     */
    public function get_devices()
    {
        $devices_to_quote = Device::orderBy('created_at', 'asc')->get();

        $most_quoted_devices_ids = DB::table('device_quote')
            ->select('device_id', DB::raw('count(*) as total'))
            ->groupBy('device_id')
            ->orderBy('total', 'desc')
            ->take(3)
            ->pluck('device_id');

        return response()->json([
            'devices_to_quote' => $devices_to_quote,
            'most_quoted_devices_ids' => $most_quoted_devices_ids
        ]);
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
        $quote_status = $request->quote_status;
        $quote = Quote::find($request->quote_id);

        // In case we publish the quote for the first time
         if ($quote_status == 'draft') {
             $quote->status = 'published';
         }
             // Check if the user already exists
             // If no, create a new user
             // If yes, add the quote to the list of existing quotes and update username/company_name
             $user = User::where('email', $request->client_email)->first();

             if ($user === null) {
                 $user = new User;
                 $user->role = 'client';
                 $user->name = $request->client_username;
                 $user->company = $request->client_company_name;
                 $user->email = $request->client_email;
                 $user->quotes()->save($quote);
                 $user->save();
             } else {
                 $user->name = $request->client_username;
                 $user->company = $request->client_company_name;
                 $user->email = $request->client_email;
                 $user->quotes()->save($quote);
                 $user->save();
             }

       /* $user = new User;
        $user->name = $request->client_username;
        $user->company = $request->client_company_name;
        $user->email = $request->client_email;
        $user->quotes()->save($quote);
        $user->save();*/

        $quote->devices()->sync(json_decode($request->quoted_devices_hidden));

        $quote->devices_desc = $request->devices_desc;
        $quote->added_accessories = $request->added_accessories;
        $quote->prices = $request->prices;
        $quote->user()->associate($user);

        $quote->save();
		
        return view('admin.save_quote', [
            'quote_guid' => $quote->guid
        ]);
    }
}
