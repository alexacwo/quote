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
					->json(Quote::where('guid', $quote_guid)
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
			
			$quote->save();

			return response()->json(
					array(
							'success' => $quote,
							'222' => $quote_guid
					));
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