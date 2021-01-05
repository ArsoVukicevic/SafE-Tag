<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Service\ClassificationService;
use Illuminate\Http\Request;
use App\Utils\Utils;

class ClassificationController extends Controller {

    private $_service;

    public function __construct(ClassificationService $service) {
        $this->_service = $service;
    }

    public function InsertClassificationAction(Request $request) {
        Utils::validateRequest($request->all(), $this->_validator());

        $response = $this->_service->insertClassification($request);

        return response()->api($response);
    }

    private function _validator() {
        return [
            'parentId' => ['bail', 'nullable', 'numeric'],
            'name'     => ['bail', 'required', 'string', 'max:50'],
            'desc'     => ['bail', 'required', 'string', 'max:255'],
            'typeId'   => ['bail', 'required', 'numeric'],
        ];
    }
}
