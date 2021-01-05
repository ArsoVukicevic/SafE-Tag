<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Providers;

use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\ServiceProvider;

/**
 * Description of ResponseServiceProvider
 *
 * @author milos
 */
class ResponseServiceProvider extends ServiceProvider {

    public function boot(ResponseFactory $factory)
    {
        $factory->macro('api', function ($data) use ($factory) {

            $customFormat = [
                'status' => 1,
                'error' => array(
                    'code' => 0,
                    'message' => ''
                ),
                'data' => $data
            ];

            return $factory->json($customFormat);
        });

        $factory->macro('apiError', function ($errorMessage = 'Generic Error', $errorCode = -1) use ($factory) {

            $customFormat = [
                'status' => -1,
                'error' => array(
                    'code' => $errorCode,
                    'message' => $errorMessage
                ),
                'data' => null
            ];

            return $factory->json($customFormat);
        });
    }

    public function register()
    {
        //
    }
}
