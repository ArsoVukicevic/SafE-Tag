<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Service\ClassificationService;
use App\Service\FactoryItemService;
use App\Utils\Utils;
use Illuminate\Http\Request;

class FactoryItemController extends Controller {

    private $_service;
    private $_cService;

    public function __construct(
        FactoryItemService $service, ClassificationService $cService
    )
    {
        $this->_service = $service;
        $this->_cService = $cService;
    }

    public function InsertItemAction(Request $request) {
        Utils::validateRequest($request->all(), $this->_validator());

        $response = $this->_service->insertItems($request);

        return response()->api($response);
    }

    public function GetClassificationAndItemTreeAction() {
        $response = new \stdClass();
        $response->items = $this->_service->getItemsTree();
        $response->classifications = $this->_cService->getClassificationTree();

        return response()->api($response);
    }

    public function UpdateItemAction(Request $request) {
        Utils::validateRequest($request->all(), [
            'source' => ['required', 'string'],
        ]);

        if ($request->json('source') == 'Classification') {
            $this->_cService->updateClassification($request);
        } else if ($request->json('source') == 'Location') {
            $this->_service->updateItem($request);
        }

        return response()->api(true);
    }

    private function _validator() {
        return [
            'parentId' => ['bail', 'nullable', 'numeric'],
            'codeDesc' => ['bail', 'required', 'string', 'max:20'],
            'desc'     => ['bail', 'required', 'string', 'max:255'],
        ];
    }
}
