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
		 * Handle CSV file uploading
		 * @param $path
		 * @param $filename
		 * @return \Illuminate\Http\Response
		 */
		private function import_csv($csv_file)
		{ 				
			$handle = fopen($csv_file, "r");
			
			// Get all available accessories list
			$accessories = DB::table('accessories_copy')->pluck('id', 'part_number');
			$i = 0;
			$result = array();
			$import_results = array();
			while (($data = fgetcsv($handle, 1500, ";")) !== FALSE) {
				
				// Jump the first row
				if ($i > 0) {
					$accessory_part_number = $data[2];
					if ($accessories->has($accessory_part_number)) {
						// update				
						$accessory = Accessory::where('part_number', $accessory_part_number)->first();	
						$import_results[$accessory->part_number] = 'updated';
					} else {
						// insert
						$accessory = new Accessory;
						$accessory->part_number = $data[2];						
						$import_results[$accessory->part_number] = 'inserted';
					}
					
					$cost = str_replace("$", "", $data[7]);
					$cost = str_replace(",", "", $cost);					
					$price = str_replace("$", "", $data[4]);
					$price = str_replace(",", "", $price);
					
					$accessory->description = $data[1];
					$accessory->cost = $cost;
					$accessory->price = $price;
					//$accessory->save();
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
				$path = base_path().'/storage/files/accessories_csv/';
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
