<?php

	namespace App\Http\Controllers\Api\Admin;

	use App\User;
	use App\QuoteRequest;
	use App\Quote;
	use App\Device;
	use App\Accessory;
	use Illuminate\Http\Request;
	use Illuminate\Http\Response;
	use App\Http\Controllers\Controller;

	class AccessoriesApiController extends Controller
	{
		/**
		 * Send information about devices as JSON
		 *
		 * @return Response
		 */
		public function index()
		{
			return response()->json(Accessory::get());
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @return Response
		 */
		public function store()
		{
			return response()->json(array('success' => true));
		}

		/**
		 * Update the specified accessory
		 *
		 * @param  int  $accessory_id
		 *
		 * @return Response
		 */
		public function update($user_id)
		{
			return response()->json(Accessory::get($user_id));
		}

		/**
		 * Remove the specified quote from storage
		 *
		 * @param  int  $id
		 * @return Response
		 */
		public function destroy($id)
		{
			Quote::destroy($id);

			return response()->json(array('success' => true));
		}
	}
