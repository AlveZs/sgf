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

/*Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
Route::get('relatorio_pdf', 'PDFController@index');
Route::get('relatorio_pdf/pdf', 'PDFController@pdf');*/

Route::get('/', function () {
    return view('singlepage');
});

Route::post('/auth/login', 'ApiAuthController@login');
Route::post('/auth/registro', 'ApiAuthController@register');
Route::get('/auth/logout', 'ApiAuthController@logout');