<?php

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
Route::post('/login', 'Auth\LoginController@ApiLoginAction');
Route::post('/imgUpload', 'Api\ImageUploadController@UploadAction');

Route::post('/sendNotIf', function() {
    $oneSignal = new App\Service\OneSignalService();
    $oneSignal->sendNotif('Tag Open...', [58], ['tagOpena'=>'bar']);

    return response()->api(true);
});

Route::post('/cacheflush', function() {
    Cache::flush();
    die('Cache::flushed');
});

Route::middleware('auth:viaRequest')->group(function () {
    Route::post('/getItemTree', 'Api\FactoryItemController@GetItemTreeAction');
    Route::post('/getClassificationTree', 'Api\ClassificationController@GetClassificationTreeAction');

    Route::post('/openTag', 'Api\TagController@OpenTagAction');
    Route::post('/getOpenTags', 'Api\TagController@GetOpenTagsAction');
    Route::post('/getTagsCount', 'Api\TagController@GetTagsCountAction');
    Route::post('/getOpenTagDetails', 'Api\TagController@GetOpenTagDetailsAction');
    Route::post('/getTaskToDo', 'Api\TagController@GetTaskToDoAction');
    Route::post('/assignTag', 'Api\TagController@AssignTagAction');
    Route::post('/resolveTask', 'Api\TagController@ResolveTaskAction');
    Route::post('/getAchievements', 'Api\TagController@AchievementsAction');

    Route::post('/getEmployees', 'Api\EmployeesController@GetEmployeesAction');
    Route::post('/logout', 'Auth\LoginController@ApiLogoutAction');
    Route::post('/getAudit', 'Api\AuditController@GetAuditAction');
    Route::post('/closeAudit', 'Api\AuditController@CloseAuditAction');
});