<?php

namespace App\Http\Controllers\Admin;

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

class UsersApiController extends Controller
{
	/**
	 * Send information about users as JSON
	 *
	 * @return Response
	 */
	public function index()
	{
		return response()->json(User::with('quotes')->get());
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
