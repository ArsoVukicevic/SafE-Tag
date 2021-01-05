<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\AuditService;
use Illuminate\Http\Request;

class AuditController extends Controller {

    private $_auditService;

    public function __construct(AuditService $auditService) {
        $this->_auditService = $auditService;
    }

    public function GetAuditAction() {
        $response = $this->_auditService->getAudit();

        return response()->api($response);
    }

    public function CloseAuditAction(Request $request) {
        $audit = $request->json('audit');
        $auditId = $request->json('auditId');
        $response = $this->_auditService->closeAudit($audit, $auditId);

        return response()->api($response);
    }
}
