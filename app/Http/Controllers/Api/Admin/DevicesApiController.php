<?php
	
	namespace App\Http\Controllers\Api\Admin;
	
	use DB;
	use Illuminate\Support\Facades\Input;
	
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
		 * Handle CSV file uploading
		 * @param $path
		 * @param $filename
		 * @return \Illuminate\Http\Response
		 */
		private function import_csv($csv_file)
		{ 				
			$handle = fopen($csv_file, "r");
			
			// Get all available devices list
			$devices = DB::table('devices_copy')->pluck('id', 'model');
			$i = 0;
			$result = array();
			$import_results = array();
			while (($data = fgetcsv($handle, 1500, ";")) !== FALSE) {
				
				// Jump the first row
				if ($i > 0) {
					$device_model = $data[2];
					if ($devices->has($device_model)) {
						// update				
						$device = Device::where('model', $device_model)->first();	
						$import_results[$device->model] = 'updated';
					} else {
						// insert
						$device = new Device;
						$device->model = $data[2];						
						$import_results[$device->model] = 'inserted';
					}
					
					$device->make = $data[1];
					$device->cost = $data[3];
					$device->base = $data[4];
					$device->speed = $data[5];
					$device->paper_size = $data[6];
					$device->color_or_mono = $data[7];
					$device->device_type = $data[8];
					$device->maintenance = $data[9];
					$device->cost_per_color_page = $data[10];
					$device->cost_per_mono_page = $data[11];
					$device->rebates = $data[12];
					$device->image = $data[13];
					$device->pdf = $data[14];
					//$device->save();
						
				}
				$i++;
			}

			return $import_results;
		}
		
		/**
		 * Upload CSV sheet with devices data
		 * @param Request $request
		 * @return \Illuminate\Http\Response
		 */
		public function upload_csv(Request $request)
		{
			if (Input::hasFile('file')){

				$file = Input::file('file');
				$name = $file->getClientOriginalName();

				//check out the edit content on bottom of my answer for details on $storage
				$path = base_path().'/storage/files/devices_csv/';
				// Moves file to folder on server
				$file->move($path, $name);

				// Import the moved file to DB and return OK if there were rows affected
				$result = $this->import_csv( $path . $name );
				$response = $result ? $result : 'No rows affected';
				
				return response()->json($response);

			} else {	 
				return response()->json(array('error' => 'Something happened'));
			}
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
