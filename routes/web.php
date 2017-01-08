<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*

//OLD ROUTES
Route::get('/', 'Client\ClientController@index');

Route::post('/save-calculation/{quote_id}', 'Client\ClientController@save_calculation');

Route::get('/quote/{quote_guid}', 'Client\ClientController@view_quote');
 
Route::group(['middleware' =>  'auth' ], function () {
    Route::group(['middleware' =>  'roles:admin' ], function () {
        Route::get('/admin', 'Admin\AdminController@index');
 

        Route::get('/admin/users', 'Admin\AdminController@users');

        Route::get('/admin/quotes', 'Admin\AdminController@quotes');

        Route::get('/admin/quote/{quote_guid}', 'Admin\AdminController@edit_quote');

        Route::get('/admin/get-devices', 'Admin\AdminController@get_devices');

        Route::post('/admin/create-quote', 'Admin\AdminController@create_quote');

        Route::post('/admin/save-quote', 'Admin\AdminController@save_quote');

    });
}); 
*/
Route::group(array('prefix' => 'api'), function() {
	
	Route::post('send_mail', 'Api\Client\ViewQuoteApiController@send_mail');
	
	Route::post('quotes/update_views_counter/{quote_guid}', 'Api\Client\ViewQuoteApiController@update_views_counter');
	
	Route::resource('quotes', 'Api\Client\ViewQuoteApiController',
			array('only' => array('index', 'show', 'update')));	
});
	
Auth::routes();

/* Angular routing for admin dashboard */

Route::group(['middleware' =>  'auth' ], function () {

	 Route::group(array('prefix' => 'adm/api'), function() {
		 
		Route::get('quotes/get-capsule-users/{first_name}/{last_name}/{email}', 'Api\Admin\QuoteApiController@get_capsule_users_list');
		
		Route::post('quotes/duplicate', 'Api\Admin\QuoteApiController@duplicate');
		
		Route::post('quotes/unpublish-quote', 'Api\Admin\QuoteApiController@unpublish_quote');
		
		Route::resource('quotes', 'Api\Admin\QuoteApiController');

		Route::resource('users', 'Api\Admin\UsersApiController',
				array('only' => array('index', 'store', 'destroy')));

		Route::post('devices/upload-file', 'Api\Admin\DevicesApiController@upload_file');
		
		Route::post('devices/upload-csv', 'Api\Admin\DevicesApiController@upload_csv');
		
		Route::get('devices/qet-most-quoted', 'Api\Admin\DevicesApiController@get_most_quoted_devices');

		Route::resource('devices', 'Api\Admin\DevicesApiController');

		Route::get('accessories/search-by-part-number/{part_number}', 'Api\Admin\AccessoriesApiController@search_by_part_number');
		
		Route::post('accessories/upload-csv', 'Api\Admin\AccessoriesApiController@upload_csv');
		
		Route::resource('accessories', 'Api\Admin\AccessoriesApiController',
				array('only' => array('index', 'store', 'update', 'destroy')));

	});

	Route::get('adm/', function () {
		return view('admin.angular');
	});
	Route::get( 'adm/{all}', function () {
		return view('admin.angular');
	})->where('all', '.*');
});

Route::get( '{all}', function () {
	return view('client.angular');
})->where('all', '^((?!adm).)*$');
