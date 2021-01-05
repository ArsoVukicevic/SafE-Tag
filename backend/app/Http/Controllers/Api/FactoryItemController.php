<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\FactoryItemService;

class FactoryItemController extends Controller {

    private $_service;

    public function __construct(FactoryItemService $service) {
        $this->_service = $service;
    }

    public function GetItemTreeAction() {
        $itemTree = $this->_service->getActiveItemsTree();
        return response()->api($itemTree);
    }
}
