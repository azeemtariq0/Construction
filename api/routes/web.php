<?php
use Illuminate\Support\Facades\Route;
/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

// $router->get('/',['Middleware'=>['auth'], function () use ($router) {
//     return $router->app->version();
  
// }]);


$router->group([
        'middleware' => ['cors'],
    ], function ($router) {
         
    });

$router->get('test', 'Controller@testApi');

$router->post('auth/login', 'AuthController@login');
$router->post('auth/session', 'AuthController@session');
$router->post('auth/logout', 'AuthController@logout');
$router->post('auth/check-admin', 'AuthController@checkAdmin');
$router->post('auth/refresh', 'AuthController@refresh');
$router->post('auth/profile', 'AuthController@me');

//forgot Password
$router->post('auth/verify-email', 'AuthController@verifyEmail');
$router->post('reset-password', 'AuthController@forgotPassword');

// Test Route
$router->get('/', 'UserController@testApi');

// Dashboard
$router->group(['prefix' => 'dashboard'], function ($router) {
 $router->get('/', 'DashboardController@index');
});

// Users
$router->group(['prefix' => 'user'], function ($router) {
 $router->get('/', 'UserController@index');
 $router->get('/{id}', 'UserController@show');
 $router->post('/', 'UserController@store');
 $router->put('/{id}', 'UserController@update');
 $router->delete('/{id}', 'UserController@delete');
 $router->post('/bulk-delete', 'UserController@bulkDelete');
});
$router->post('change-password', 'UserController@changePassword');


// Permission 

$router->group(['prefix' => 'permission'], function ($router) {
   $router->get('/', 'PermissionController@index');
   $router->get('/{id}', 'PermissionController@show');
   $router->post('/', 'PermissionController@store');
   $router->put('/{id}', 'PermissionController@update');
   $router->delete('/{id}', 'PermissionController@delete');
   $router->post('/bulk-delete', 'PermissionController@bulkDelete');
});

$router->get('lookups/country', 'LookUpsController@getCountry');


// Expense Type
$router->group(['prefix' => 'expense_type'], function ($router) {
  $router->get('/', 'ExpenseTypeController@index');
  $router->get('/{id}', 'ExpenseTypeController@show');
  $router->post('/', 'ExpenseTypeController@store');
  $router->put('/{id}', 'ExpenseTypeController@update');
  $router->delete('/{id}', 'ExpenseTypeController@delete');
  $router->post('/bulk-delete', 'ExpenseTypeController@bulkDelete');
});

// Orders
$router->group(['prefix' => 'expense'], function ($router) {
  $router->get('/', 'ExpenseController@index');
  $router->post('/', 'ExpenseController@store');
  $router->get('/{id}', 'ExpenseController@show');
  $router->put('/{id}', 'ExpenseController@update');
  $router->post('update-status/', 'ExpenseController@updateStatus');
  $router->post('buy-again/', 'ExpenseController@buyAgain');
  $router->get('generate-pdf/{id}', 'ExpenseController@generatePdf');
});

// Messages
$router->group(['prefix' => 'messages'], function ($router) {
   $router->get('/', 'MessageController@index');
});

// Notification
$router->group(['prefix' => 'notification'], function ($router) {
   $router->get('/', 'NotificationController@index');
   $router->delete('/{id}', 'NotificationController@delete');
   $router->post('/bulk-delete', 'NotificationController@bulkDelete');
   $router->post('/read-all', 'NotificationController@readAll');
   
});


// Portal
$router->group(['prefix' => 'portal'], function ($router) {
 $router->get('/', 'PortalController@index');
 $router->post('/', 'PortalController@store');
 $router->get('/{id}', 'PortalController@show');
 $router->put('/{id}', 'PortalController@update');
 $router->delete('/{id}', 'PortalController@delete');
});

//File Directory
$router->group(['prefix' => 'directory'], function ($router) {
 $router->get('/', 'DirectoryController@index');
 $router->post('/', 'DirectoryController@store');
 $router->get('/{id}', 'DirectoryController@show');
 $router->put('/{id}', 'DirectoryController@update');
 $router->delete('/{id}', 'DirectoryController@delete');
 $router->post('download-zip', 'DirectoryController@downloadZip');
 $router->post('bulk-delete-files', 'DirectoryController@bulkDeleteFiles');
 
});

 //Logs
$router->get('/log-history', 'QuoteRequestController@logList');

// Setting
$router->group(['prefix' => 'setting'], function ($router) {
 $router->put('/{id}', 'SettingController@update');
 $router->get('/{id}', 'SettingController@show');
 $router->post('/email-debugging', 'SettingController@EmailDubugging');
});

// Setting
$router->group(['prefix' => 'email-template'], function ($router) {
 $router->get('/', 'EmailTemplateController@index');
 $router->post('/', 'EmailTemplateController@store');
 $router->get('/{id}', 'EmailTemplateController@show');
 $router->put('/{id}', 'EmailTemplateController@update');
 $router->delete('/{id}', 'EmailTemplateController@delete');
});

// Route::post('auth/login', 'AuthController@login');