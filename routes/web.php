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

Route::get('/quote-request', 'Client\ClientController@quote_request');

Route::post('/create-quote-request', 'Client\ClientController@create_quote_request');

Auth::routes();

Route::group(['middleware' =>  'auth' ], function () {
    Route::group(['middleware' =>  'roles:admin' ], function () {
        Route::get('/admin', 'Admin\AdminController@index');

        Route::get('/admin/quote-requests', 'Admin\AdminController@quote_requests');

        Route::get('/admin/quotes', 'Admin\AdminController@quotes');

        Route::get('/admin/quote/{quote}', 'Admin\AdminController@edit_quote');

        Route::post('/admin/create-quote', 'Admin\AdminController@create_quote');

        Route::post('/admin/save-quote', 'Admin\AdminController@save_quote');

        Route::get('/quote/{quote}', 'Client\ClientController@view_quote');
    });
    Route::group(['middleware' => 'roles:user,admin' ], function () {
        Route::get('/quote/{quote}', 'Client\ClientController@view_quote');
    });
});



