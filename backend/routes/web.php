<?php

Route::get('/checkLogin', 'Auth\LoginController@WebCheckLoginAction');
Route::get('/doLogin', 'Auth\LoginController@WebLoginAction');

Route::middleware('auth')->group(function () {
    //PASS IS TEST plain

    Route::post('/insertUser', 'Web\UserController@InsertUserAction');
    Route::post('/updateUser', 'Web\UserController@UpdateUserAction');
    Route::post('/insertFactory', 'Web\FactoryController@InsertFactoryAction');
    Route::post('/updateFactory', 'Web\FactoryController@UpdateFactoryAction');
    Route::post('/insertClassification', 'Web\ClassificationController@InsertClassificationAction');
    Route::post('/insertItem', 'Web\FactoryItemController@InsertItemAction');
    Route::post('/updateItem', 'Web\FactoryItemController@UpdateItemAction');
    Route::post('/insertAudit', 'Web\AuditController@InsertAuditAction');
    //Rename with init data... and add auth
    Route::get('/insertUserView', 'Web\UserController@InsertUserViewAction');
    Route::get('/getUsers', 'Web\UserController@GetUsersAction');
    Route::get('/getFactories', 'Web\FactoryController@GetFactoriesAction');
    Route::get('/getClassificationAndItemTree', 'Web\FactoryItemController@GetClassificationAndItemTreeAction');
    Route::get('/getFactory', 'Web\FactoryController@FactoryAction');
    Route::get('/getAudit', 'Web\AuditController@GetAuditAction');
    Route::get('/logout', 'Auth\LoginController@WebLogoutAction');
});

Route::get('/hash-pass', function () {
    return response()->api(Hash::make('test'));
});

Route::get('/test', function () {
    return view('test');
});