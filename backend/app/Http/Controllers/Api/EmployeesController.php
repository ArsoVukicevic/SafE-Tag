<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\EmployeesService;

class EmployeesController extends Controller
{

    private $_service;

    public function __construct(EmployeesService $employeesService)
    {
        $this->_service = $employeesService;
    }

    public function GetEmployeesAction()
    {
        $employees = $this->_service->getEmployeesForAssign();
        $response = [];
        foreach ($employees as $employee) {
            $user = new \stdClass();
            $user->id = $employee->getId();
            $user->name = $employee->getName();
            $user->lastName = $employee->getLastname();
            $user->workingPlace = $employee->getWorkingPlace();

            $response[] = $user;
        }

        return response()->api($response);
    }
}
