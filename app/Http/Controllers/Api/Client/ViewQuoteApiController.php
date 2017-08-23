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
	use App\Mail\sendNotification;
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
		 * Update the specified quote
		 * @param Request $request
		 * @param int $quote_id
		 *
		 * @return Response
		 */
		public function update_views_counter(Request $request, $quote_guid)
		{
			$quote = Quote::where('guid', $quote_guid)->first();

			$quote->no_of_views = $request->no_of_views;
			$quote->last_view = $request->last_view;
			
			$quote->save();
 
			return response()->json(
					array(
							'success' => $quote,
							'1' =>  $request->no_of_views,
							'2' => $request->last_view
					));
		}
			
		/**
		 * Generate PDF
		 * @param Request $request
		 *
		 * @return Response
		 */
		public function generate_pdf(Request $request)
		{	
			require_once (dirname(__FILE__).'/fpdi.php');
			
			// Forming the client sheet PDf
			$client_sheet_pdf = base64_decode($request->client_sheet_data);
			$temp_file_name = 'storage/copier_files/copier-pdf/temp/' . $request->guid . '.pdf';
			file_put_contents($temp_file_name, $client_sheet_pdf);
		
			// Array of devices pdfs
			$pdfs_array = $request->pdfs_array;
			
			$fpdi = new \FPDI();			 
			
			$pageCount = $fpdi->setSourceFile($temp_file_name); 
			for ($i = 0; $i < $pageCount; $i++) { 
				$tpl = $fpdi->importPage($i + 1, '/MediaBox'); 
				$fpdi->addPage(); 
				$fpdi->useTemplate($tpl); 
			} 
 
			// iterate over array of files and merge 
			foreach ($pdfs_array as $file) {  
				$pageCount = $fpdi->setSourceFile($file); 
				for ($i = 0; $i < $pageCount; $i++) { 
					$tpl = $fpdi->importPage($i + 1, '/MediaBox'); 
					$fpdi->addPage(); 
					$fpdi->useTemplate($tpl); 
				} 
			} 
			
			$fpdi->Output('F', 'storage/copier_files/copier-pdf/temp/PahodaImageProducts_' . $request->guid . '.pdf');			 
			
			unlink($temp_file_name);
			
			return response()->json(array('message' => dirname(__FILE__)));
		}
		
		/**
		 * Remove PDF file after saving
		 * @param Request $request
		 *
		 * @return Response
		 */
		public function confirm_saving(Request $request)
		{		
			\File::delete('storage/copier_files/copier-pdf/temp/PahodaImageProducts_' . $request->guid . '.pdf');		
			$file_exists = \File::exists('storage/copier_files/copier-pdf/temp/PahodaImageProducts_' . $request->guid . '.pdf');
			
			return response()->json(array('message' => $file_exists));
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
		 * Send notification with lease details
		 * @param Request $request
		 *
		 * @return Response
		 */
		public function send_lease_notification(Request $request)
		{ 
			$offer_status = $request->offer_status;
			$lease_form = array();
			
			$lease_form_fields = array(
				'company',
				'contactPerson',
				'email',
				'phone',
				'address',
				'city',
				'state',
				'zipCode',
				'billTo',
				'howLongInBusiness',
				'buyOut'
			);
			foreach ($lease_form_fields as $lease_form_field) {
				$lease_form[$lease_form_field] = (isset($request->lease_form[$lease_form_field])) ? $request->lease_form[$lease_form_field] : '';
			}
			
			$recipient = $request->recipient;
			$company = $request->company;
			
			switch ($recipient) {
				case "laine":
					$sales_rep_data = array(
						'mail' => 'laine@pahoda.com',
						'sales_rep' => 'Laine Dobson',
						'company' => $company
					);
					$new_user_data = array_merge($lease_form, $sales_rep_data);
					break;
				case "greg":
					$sales_rep_data = array(
						'mail' => 'greg@pahoda.com',
						'sales_rep' => 'Greg Bentz',
						'company' => $company
					);
					$new_user_data = array_merge($lease_form, $sales_rep_data);
					break;
				case "jesse":
				default:
					$sales_rep_data = array(
						'mail' => 'jesse@pahoda.com', 
						'sales_rep' => 'Jesse Harwell',
						'company' => $company
					);
					$new_user_data = array_merge($lease_form, $sales_rep_data);
					break; 
			}
			
			switch ($offer_status) {
				case "rejected":
					Mail::send(
						'emails.notification_device_rejected',
						$new_user_data,
						function ($message) use ($new_user_data) {
							$message->from('noreply@perfectcopier.com', 'Pahoda Image Products');
							$message->to($new_user_data['mail'], $new_user_data['sales_rep'])->subject('Perfectcopier Lease Form information: Device Quote Rejected');
						}
					);
					break;
				case "accepted":
				default:		
					$sales_rep_data = array (
						array (
							'mail' => 'jesse@pahoda.com', 
							'sales_rep' => 'Jesse Harwell',
							'company' => $company
						), 
						array (
							'mail' => 'greg@pahoda.com', 
							'sales_rep' => 'Greg Bentz',
							'company' => $company
						), 
						array (
							'mail' => 'laine@pahoda.com', 
							'sales_rep' => 'Laine Dobson',
							'company' => $company
						), 
						array (
							'mail' => '12toydolls46@gmail.com',
							'sales_rep' => 'Alex',
							'company' => $company
						)
					);					
					foreach ($sales_rep_data as $sales_rep_array) {						
						$new_user_data = array_merge($lease_form, $sales_rep_array);
						
						Mail::send(
							'emails.notification_device_accepted',
							$new_user_data,
							function ($message) use ($new_user_data) {
								$message->from('noreply@perfectcopier.com', 'Pahoda Image Products');
								$message->to($new_user_data['mail'], $new_user_data['sales_rep'])->subject('Perfectcopier notification: Device Quote Accepted');
							}
						);
					}
										
					break;
			}			
			return response()->json(array('message' => $lease_form));
		}
		/**
		 * Send notification with quote's details to the administrator
		 * @param Request $request
		 *
		 * @return Response
		 */
		public function send_notification(Request $request)
		{	
			$quote_review = $request->quote_review;
			$phone_number = $request->phone_number;
			$recipient = $request->recipient;
			$pdf_data = base64_decode($request->pdf_base64_data);
			$quote_annotations = $request->quote_annotations;
			$quote_guid = $request->quote_guid;
			$to_company = is_null($request->company) ? '' : 'to ' . $request->company;
			 
			$user_data = array(
				'phone_number' => $phone_number,
				'pdf_data' => $pdf_data,
				'quote_annotations' => $quote_annotations,
				'quote_guid' => $quote_guid,
				'to_company' => $to_company
			);
			 
			switch ($recipient) {
				case "laine":
					$sales_rep_data = array(
						'mail' => 'laine@pahoda.com',
						'sales_rep' => 'Laine Dobson',
					);
					$user_data = array_merge($user_data, $sales_rep_data);
					break;
				case "greg":
					$sales_rep_data = array(
						'mail' => 'greg@pahoda.com',
						'sales_rep' => 'Greg Bentz'
					);
					$user_data = array_merge($user_data, $sales_rep_data);
					break;
				case "jesse":
				default:
					$sales_rep_data = array(
						'mail' => 'jesse@pahoda.com', 
						'sales_rep' => 'Jesse Harwell'
					);
					$user_data = array_merge($user_data, $sales_rep_data);
					break;
			}
			
			switch ($quote_review) {
				case "needs":
					Mail::send(
						'emails.notification_template_rejected',
						$user_data,
						function ($message) use ($user_data) {
							$message->from('noreply@perfectcopier.com', 'Pahoda Image Products');
							$message->to($user_data['mail'], $user_data['sales_rep'])->subject('Perfectcopier notification: Quote Rejected');
							
							$message->attachData($user_data['pdf_data'], 'PahodaImageQuote_' . $user_data['quote_guid'] . '.pdf');
						}
					);
					break;
				case "perfect":
				default:				
					$user_data = array(
						'phone_number' => $phone_number,
						'pdf_data' => $pdf_data,
						'quote_annotations' => $quote_annotations,
						'quote_guid' => $quote_guid,
						'to_company' => $to_company
					);
					//Send message to all three reps
					$sales_rep_data = array (
						array (
							'mail' => 'jesse@pahoda.com', 
							'sales_rep' => 'Jesse Harwell'
						), 
						array (
							'mail' => 'greg@pahoda.com', 
							'sales_rep' => 'Greg Bentz'
						), 
						array (
							'mail' => 'laine@pahoda.com', 
							'sales_rep' => 'Laine Dobson'
						)
					);					
					foreach ($sales_rep_data as $sales_rep_array) {						
						$new_user_data = array_merge($user_data, $sales_rep_array);
						
						Mail::send(
							'emails.notification_template_accepted',
							$new_user_data,
							function ($message) use ($new_user_data) {
								$message->from('noreply@perfectcopier.com', 'Pahoda Image Products');
								$message->to($new_user_data['mail'], $new_user_data['sales_rep'])->subject('Perfectcopier notification: Quote Accepted');
								
								$message->attachData($new_user_data['pdf_data'], 'PahodaImageQuote_' . $new_user_data['quote_guid'] . '.pdf');
							}
						);
					}
										
					break;
			}
			
			return response()->json(array('message' => $quote_annotations));
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