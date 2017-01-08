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
			/*$most_quoted_devices_ids = DB::table('device_quote')
				->select('device_id', DB::raw('count(*) as total'))
				->groupBy('device_id')
				->orderBy('total', 'desc')
				->take(5)
				->pluck('device_id');
			
			$devices = Device::findMany($most_quoted_devices_ids);*/
			
			//$devices = Device::findMany([244, 229, 230, 245, 256]);
			$devices = Device::where(function ($query) {
				$query->orWhere('model', '=', 'WorkCentre 7830i');
				$query->orWhere('model', '=', 'WorkCentre 6655i');
				$query->orWhere('model', '=', 'WorkCentre 4265');
				$query->orWhere('model', '=', 'WorkCentre 7835i');
				$query->orWhere('model', '=', 'WorkCentre 7225i');
			})->get();
			
			return response()->json($devices);
		}
		
		/**
		 * Store a newly created resource in storage.
		 * We assume that with this method the device was created by user, for CSV uploading check $this->upload_csv
		 * @return Response
		 */
		public function store()
		{
			$device = new Device;
			$device->created_by = 'user';
			$device->save();
			
			return response()->json(array('id' => $device->id));
		}
		
		/**
		 * Show the specified device
		 *
		 * @param  int  $device_id
		 *
		 * @return Response
		 */
		public function show($device_id)
		{
			return response()
					->json(Device::where('id', $device_id)
					->with('accessories')
					->first());
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
				
				if ($accessory['id'] == null) {
					$accessory_model = new Accessory;
				} else {					
					$accessory_model = Accessory::find($accessory['id'])->first();	
				}
				$accessory_model->description = $accessory['description'];				
				$accessory_model->part_number = $accessory['part_number'];
				$accessory_model->cost = $accessory['cost'];
				$accessory_model->price = $accessory['price'];
				
				$accessory_model->save();				
				
				if ($accessory['id'] == null) {
					$accessories_ids[] = $accessory_model->id;
				} else {	
					$accessories_ids[] = $accessory['id'];
				}
			}
			
			$accessories_models = Accessory::find($accessories_ids);
			
			$device = Device::find($device_id);
			$device->model = $request->device_data['model'];
			$device->make = $request->device_data['make'];
			$device->cost = $request->device_data['cost'];
			$device->price = $request->device_data['price'];
						
			$device->speed = $request->device_data['speed'];
			$device->paper_size = $request->device_data['paper_size'];
			$device->color_or_mono = $request->device_data['color_or_mono'];
			$device->device_type = $request->device_data['device_type'];
			$device->maintenance_cost = $request->device_data['maintenance_cost'];
			$device->maintenance_price = $request->device_data['maintenance_price'];
			$device->cost_per_color_page = $request->device_data['cost_per_color_page'];
			$device->cost_per_mono_page = $request->device_data['cost_per_mono_page'];
			$device->rebates = $request->device_data['rebates'];
			
			$device->pdf = $request->device_data['pdf'];
			$device->ced = $request->device_data['ced'];
			$device->image = $request->device_data['image'];
			
			$device->accessories()->sync($accessories_models);
			$device->save();

			return response()->json(array('success' => $accessories_ids));
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
			$devices = DB::table('devices')->pluck('id', 'model');
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
					$device->price = $data[4];
					$device->speed = $data[5];
					$device->paper_size = $data[6];
					$device->color_or_mono = $data[7];
					$device->device_type = $data[8];
					$device->maintenance_price = $data[9];
					$device->cost_per_color_page = str_replace(",",".",$data[10]);
					$device->cost_per_mono_page = str_replace(",",".",$data[11]);
					$device->rebates = $data[12];
					$device->image = $data[13];
					$device->pdf = $data[14];
					
					$device->created_by = 'csv_upload';
					
					$device->save();
						
				}
				$i++;
			}

			return $import_results;
			//return $devices;
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
				$path = base_path().'/storage/files/devices_csv/';
				$file->move($path, $name);

				$result = $this->import_csv( $path . $name );
				$response = $result ? $result : 'No rows affected';
				
				return response()->json($response);

			} else {	 
				return response()->json(array('error' => 'Something happened'));
			}
		}
			
		/**
		 * Upload file
		 * @param Request $request
		 * @return \Illuminate\Http\Response
		 */
		public function upload_file(Request $request)
		{
			if (Input::hasFile('file')){
				$file = Input::file('file');
				$name = $file->getClientOriginalName();

				$path = base_path().'/storage/files/';
				
				$file->move($path, $name);

				return response()->json(
					array(
						'status' => 'success',
						'path' => 'storage/files/' . $name
					)
				);
			} else {	 
				return response()->json(
					array(
						'status' => 'error'
					)
				);
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
			Device::destroy($id);
			
			return response()->json(array('success' => true));
		}
	}
