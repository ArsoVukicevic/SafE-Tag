<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Service\AuditService;
use App\Service\EmployeesService;
use App\Service\FactoryItemService;
use App\Utils\Utils;
use Illuminate\Http\Request;

class AuditController extends Controller {

    private $_auditService;

    public function __construct(AuditService $auditService) {
        $this->_auditService = $auditService;
    }

    /**
     * For example if we receive on request 38/40/42 this mean that only item with
     * id 42 can be check on audit while items 38, 40 will get status base on child.
     * If request is like this "38, 38/40, 38/40/42" this also mean that item
     * which can be check is only 42. Items 38, 38/40 is checked because this is
     * only way how to rich child 42.
     *
     * @param Request $request
     * @return type
     */
    public function InsertAuditAction(Request $request) {
        Utils::validateRequest($request->all(), $this->_insertValidator());

        $response = $this->_auditService->insertAudit(
            $request->json('assignTo'),
            $request->json('audit'),
            $request->json('name')
        );

        return response()->api($response);
    }

    /**
     * Audit can be assign only to employee which has no audit in status open
     * or done. All employee are sent to frontend that check if employee exist in
     * audit property and create list of employees on which audit can be assign
     *
     * @param FactoryItemService $itemService
     * @param EmployeesService $employeesService
     *
     * @return type
     */
    public function GetAuditAction(
        FactoryItemService $itemService, EmployeesService $employeesService
    ) {
        $response = new \stdClass();
        $response->items = $itemService->getItemsTree();
        $response->audit = $this->_auditService->getDashboardAudit($itemService);
        $response->employees = $employeesService->getEmployeesForAudit();

        return response()->api($response);
    }

    private function _insertValidator() {
        return [
            'audit' => ['bail', 'required', 'array', 'min:1'],
            'assignTo' => ['bail', 'required', 'numeric'],
        ];
    }
}
