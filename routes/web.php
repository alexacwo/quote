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

Route::get('/', 'Client\ClientController@index');

Route::post('/save-calculation/{quote_id}', 'Client\ClientController@save_calculation');

Route::get('/quote/{quote_guid}', 'Client\ClientController@view_quote');

Auth::routes();
/*
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

/* Angular routing for admin dashboard */

Route::group(['middleware' =>  'auth' ], function () {

	Route::group(array('prefix' => 'adm/api'), function() {
		
		Route::resource('quotes', 'Admin\QuoteApiController');

		Route::resource('users', 'Admin\UsersApiController',
				array('only' => array('index', 'store', 'destroy')));

		Route::get('devices/qet-most-quoted', 'Admin\DevicesApiController@get_most_quoted_devices');

		Route::resource('devices', 'Admin\DevicesApiController',
				array('only' => array('index', 'store', 'update', 'destroy')));

		Route::resource('accessories', 'Admin\AccessoriesApiController',
				array('only' => array('index', 'store', 'update', 'destroy')));

	});

	Route::get('adm/', function () {
		return view('admin.angular');
	});
	Route::get( '{all}', function () {
		return view('admin.angular');
	})->where('all', '.*');;
});