<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//Autenticacao
Route::prefix('v1')->group(function(){
    Route::post('login', 'ApiAuthController@login');
    Route::post('register', 'ApiAuthController@register');
    Route::group(['middleware' => 'auth:api'], function(){
        Route::post('getUser', 'ApiAuthController@getUser');
        Route::get('logout', 'ApiAuthController@logout');
    });
});

//Cargo Routes
Route::get('cargo/', 'CargoController@showAll');
Route::post('cargo/', 'CargoController@store');
Route::delete('cargo/{id}','CargoController@destroy');
Route::put('cargo/{id}','CargoController@update');

//Setor Routes
Route::get('setor/', 'SetorController@showAll');
Route::post('setor/', 'SetorController@store');
Route::delete('setor/{id}','SetorController@destroy');
Route::put('setor/{id}','SetorController@update');

//Funcionario Routes
Route::get('funcionario/', 'FuncionarioController@showAll');
Route::get('funcionario/rel/{set_id}/{car_id}', 'PDFController@relatorioDois');
Route::get('funcionario/set/{set_id}', 'PDFController@relatorioSetor');
Route::get('funcionario/car/{car_id}', 'PDFController@relatorioCargo');
Route::get('funcionario/rel', 'PDFController@relatorioTodos');
Route::post('funcionario/', 'FuncionarioController@store');
Route::delete('funcionario/{id}','FuncionarioController@destroy');
Route::put('funcionario/{id}','FuncionarioController@update');
