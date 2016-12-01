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
	use App\Http\Controllers\Admin\CurlController;
	
	class DevicesApiController extends Controller
	{
		/**
		 * Send information about devices as JSON
		 *
		 * @return Response
		 */
		public function index()
		{
			return response()->json(Device::with('accessories')->get());
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
		 * Show the specified user
		 *
		 * @param  int  $user_id
		 *
		 * @return Response
		 */
		public function show($user_id)
		{
			return response()->json(User::get($user_id));
		}

		/**
		 * Update the specified device
		 * @param Request $request
		 * @param int $device_id
		 *
		 * @return Response
		 */
		public function update(Request $request, $device_id)
		{
			$accessories = $request->accessories;
 
			$accessories_ids = [];
			foreach ($accessories as $accessory) {
				$accessories_ids[] = $accessory['id'];
			}
			$accessories_models = Accessory::find($accessories_ids);
			
			$device = Device::find($device_id);
			$device->accessories()->sync($accessories_models);
			$device->save();

			return response()->json(array('success' => true));

		}

		/**
		 * Get the list of most quoted devices for a quote
		 *
		 * @return \Illuminate\Http\Response
		 */
		public function get_most_quoted_devices()
		{
			$most_quoted_devices_ids = DB::table('device_quote')
				->select('device_id', DB::raw('count(*) as total'))
				->groupBy('device_id')
				->orderBy('total', 'desc')
				->take(3)
				->pluck('device_id');

			return response()->json($most_quoted_devices_ids);
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
