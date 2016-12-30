<?php

	namespace App\Http\Controllers\Api\Client;

	use DB;

	use App\User;
	use App\QuoteRequest;
	use App\Quote;
	use App\Device;
	use App\Accessory;
	use Illuminate\Http\Request;
	use Illuminate\Http\Response;
	use App\Http\Controllers\Controller;
	
	use App\Mail\sendMail;
	use Illuminate\Support\Facades\Mail;

	class ViewQuoteApiController extends Controller {

		/**
		 * Send information about quotes as JSON
		 *
		 * @return Response
		 */
		public function index()
		{
			return response()
					->json(Quote::with('user')->get());
		}

		/**
		 * Generate a new string and check (though it is very unlikely) if it exists in the database
		 *
		 * @return \Illuminate\Http\Response
		 */
		/*public function generate_guid_for_quote_link() {
			$guid = str_random(20);
			$quote = Quote::where('guid', $guid)->first();

			return ($quote === null) ? $guid : $this->generate_guid();
		}*/

		/**
		 * Store a newly created resource in storage.
		 *
		 * @return Response
		 */
	/*	public function store()
		{
			$guid = $this->generate_guid_for_quote_link();

			$quote = new Quote;
			$quote->guid = $guid;
			$quote->status = 'draft';
			$quote->save();

			return response()->json(array('guid' => $guid));
		}*/

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
					->json(Quote::where([
							['guid', '=', $quote_guid],
							['status', '=', 'published']
							])
							->with('user', 'devices.accessories')
							->first());
		}

		/**
		 * Update the specified quote
		 * @param Request $request
		 * @param int $quote_id
		 *
		 * @return Response
		 */
		public function update(Request $request, $quote_guid)
		{
			$quote = Quote::where('guid', $quote_guid)->first();

			$quote->selected_accessories = $request->selected_accessories;
			$quote->selected_custom_accessories = $request->selected_custom_accessories;
			$quote->how_did_we_do = $request->how_did_we_do;
			
			$quote->save();

			return response()->json(
					array(
							'success' => $quote,
							'quote_guid' => $quote_guid
					));
		}

		/**
		 * Send mail to the administrator
		 * @param Request $request
		 *
		 * @return Response
		 */
		public function send_mail(Request $request)
		{	
			$phone_number = $request->phone_number;
			$recipient = $request->recipient;
			
			switch ($recipient) {
				case "jesse":
					$mail = 'jesse@pahoda.com';
					break;
				case "laine":
					$mail = 'laine@pahoda.com';
					break;
				case "greg":
					$mail = 'greg@pahoda.com';
					break;
			}
			
			Mail::to($mail)->send(new sendMail($phone_number));			
			return response()->json(array('message' => 'Message sent to ' . $recipient . ' successfully'));
		}
		
		/**
		 * Remove the specified quote from storage
		 *
		 * @param  int  $id
		 * @return Response
		 */
	/*	public function destroy($id)
		{
			Quote::destroy($id);

			return response()->json(array('success' => true));
		}*/

	}