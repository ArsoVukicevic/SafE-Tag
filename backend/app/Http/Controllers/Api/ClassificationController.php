<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\ClassificationService;
use Illuminate\Http\Request;

class ClassificationController extends Controller {

    private $_service;

    public function __construct(ClassificationService $service) {
        $this->_service = $service;
    }

    public function GetClassificationTreeAction(Request $request) {
        $itemTree = $this->_service->getClassificationTree();

        $response = $itemTree;
        $typeId = $request->json('typeId');
        if ($typeId) {
            if (!isset($itemTree[$typeId])) {
                throw new \Exception('Invalid type id!');
            }
            $response = $itemTree[$typeId];
        }

        return response()->api($response);
    }
}
