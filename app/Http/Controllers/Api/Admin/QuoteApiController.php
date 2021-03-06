<?php

	namespace App\Http\Controllers\Api\Admin;

	use DB;

	use App\User;
	use App\QuoteRequest;
	use App\Quote;
	use App\Device;
	use App\Accessory;
	use Illuminate\Http\Request;
	use Illuminate\Http\Response;
	use App\Http\Controllers\Controller;
	use App\Http\Controllers\Api\Admin\CurlController;

	class QuoteApiController extends Controller {

		/**
		 * Send information about quotes as JSON
		 *
		 * @return Response
		 */
		public function index()
		{
			return response()->json(
						Quote::with('user', 'devices')
							->orderBy('id', 'desc')
							->get()
					);
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
		 * Store a newly created resource in storage.
		 *
		 * @return Response
		 */
		public function store()			
		{
			$guid = $this->generate_guid_for_quote_link();

			$quote = new Quote;
			$quote->guid = $guid;
			$quote->status = 'draft';
			$quote->editor = 'jesse';
			$quote->save();
			
			return response()->json(array('guid' => $guid));
		}

		/**
		 * Store a newly created resource in storage.
		 * @param Request $request
		 * @return Response
		 */
		public function duplicate(Request $request)			
		{
			$quote_to_duplicate = Quote::with('user', 'devices')->get()->find(intval($request->quote_to_duplicate_id));
			
			$guid = $this->generate_guid_for_quote_link();

			$new_quote = new Quote;
			$new_quote->guid = $guid;
			$new_quote->status = 'draft';
						
			$new_quote->added_accessories = $quote_to_duplicate->added_accessories;
			$new_quote->allowed_prices = $quote_to_duplicate->allowed_prices;
			$new_quote->custom_accessories = $quote_to_duplicate->custom_accessories;
			$new_quote->custom_descriptions = $quote_to_duplicate->custom_descriptions;
			$new_quote->editor = $quote_to_duplicate->editor;
			$new_quote->cover_letter_position = $quote_to_duplicate->cover_letter_position;	
			$new_quote->sales_rep_notes = $quote_to_duplicate->sales_rep_notes;		
			$new_quote->devices_desc = $quote_to_duplicate->devices_desc;
			$new_quote->displayed_price = $quote_to_duplicate->displayed_price;
			$new_quote->included_pages = $quote_to_duplicate->included_pages;
			$new_quote->quoted_devices = $quote_to_duplicate->quoted_devices;
			$new_quote->prices = $quote_to_duplicate->prices;
			$new_quote->rates_options = $quote_to_duplicate->rates_options;
			//$new_quote->selected_accessories = $quote_to_duplicate->selected_accessories;
			$new_quote->sum_up = $quote_to_duplicate->sum_up;
			
			$new_quote->user()->associate($quote_to_duplicate->user);
			
			$new_quote->save();
			
			$new_quote->devices()->attach($quote_to_duplicate->devices);
			
			return response()->json(array('guid' => $guid));
		}
		
		/**
		 * Show the specified quote
		 *
		 * @param  int  $quote_guid
		 *
		 * @return Response
		 */
		public function show($quote_guid)
		{
			return response()
					->json(
						Quote::where('guid', $quote_guid)
						->with('user', 'devices.accessories')
						->first()
					);
		}

		/**
		 * Update the specified quote
		 * @param Request $request
		 * @param int $quote_id
		 *
		 * @return Response
		 */
		public function update(Request $request, $quote_id)
		{
			$quote_status = $request->status;
			$quote = Quote::find($quote_id);
 			
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
			}			 
			$user->user_type = $request->user_type;
			$user->name = $request->client_username;
			$user->company = $request->client_company;
			$user->email = $request->client_email;
			$user->quotes()->save($quote);
			$user->save();

			$quote->added_accessories = $request->added_accessories;
			$quote->allowed_prices = $request->allowed_prices;
			$quote->custom_accessories = $request->custom_accessories;
			$quote->custom_descriptions = $request->custom_descriptions;
			$quote->devices()->sync($request->added_devices);
			$quote->devices_desc = $request->devices_desc;
			$quote->displayed_price = $request->displayed_price;
			$quote->editor = $request->editor;
			$quote->cover_letter_position = $request->cover_letter_position;	
			$quote->sales_rep_notes = $request->sales_rep_notes;
			$quote->included_pages = $request->included_pages;
			$quote->quoted_devices = $request->quoted_devices;			
			$quote->prices = $request->prices;
			$quote->rates_options = $request->rates_options;
			$quote->sum_up = $request->sum_up;
			$quote->user()->associate($user);

			$quote->save();
			
			return response()->json(array('success' => true));
		}
		
		/**
		 * Get Capsule CRM users
		 *
		 * @param  First name $first_name
		 * @param  Last name $last_name
		 * @param  Email $email
		 * @return Response
		 */
		public function get_capsule_users_list($first_name, $last_name, $email) {
		
			if (
				($first_name != 'undefined') 
				||
				($last_name != 'undefined')
				||
				($email != 'undefined')
			) {
				$curl = new CurlController;
				
				$url = "https://pahoda.capsulecrm.com/api/party?q=";				
				if ($first_name != 'undefined') {
					$url .= $first_name;
				}
				if ($first_name != 'undefined' && $last_name != 'undefined') {
					$url .= '+';
				}				
				if ($last_name != 'undefined') {
					$url .= $last_name;
				}
				if (($first_name != 'undefined' || $last_name != 'undefined') && $email != 'undefined') {
					$url .= '&';
				}			
				if ($email != 'undefined') {
					$url .= "email=" . $email;
				}
				
				$username = "108fa7bce4476acba87cd36f699b2df9";
				$password = "x";
				$json_response = $curl->get($url, $username, $password);
				$response = json_decode($json_response);

				if (is_object($response)) {
				
					$contacts = $response->parties;
								
					if (property_exists($contacts,'person')) {
						return response()->json(array('contacts' => $contacts->person));
					} else {						
						return response()->json(array('error' => 'Nothing is found'));
					}
				} else {
					return response()->json(array('error' => $json_response));				
				}
			} else {
				return response()->json(array('error' => 'No query variables set'));					
			}
		}

		/**
		 * Set the quote status to draft
		 *
		 * @param  Request $request
		 * @return Response
		 */
		public function unpublish_quote(Request $request) {
			$quote = Quote::find($request->quote_id);
			$quote->status = 'draft';
			$quote->save(); 

			return response()->json(array('success' => $request->quote_id));
		}

		/**
		 * Remove the specified quote from storage
		 *
		 * @param  int  $id
		 * @return Response
		 */
		/*public function destroy($id)
		{
			Quote::destroy($id);

			return response()->json(array('success' => true));
		}*/

	}