<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Http\Controllers\Web;

use App\Exceptions\ExceptionCode;
use App\Http\Controllers\Controller;
use App\Service\FactoryService;
use App\Type\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FactoryController extends Controller {

    private $_factoryService;

    public function __construct(FactoryService $factoryService) {
        $this->_factoryService = $factoryService;
    }

    public function FactoryAction() {
        $factory = $this->_factoryService->getFactory();

        return response()->api($factory);
    }

    public function GetFactoriesAction() {
        return response()->api(
            array_values($this->_factoryService->getFactories())
        );
    }

    public function InsertFactoryAction(Request $request) {
        $validator = $this->_validator($request->all());

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->all()[0], ExceptionCode::INVALID_REQ_PARAMS);
        }

        $factory = $this->_factoryService->insertFactory($request);

        return response()->api($factory);
    }

    public function UpdateFactoryAction(Request $request) {
        $validator = $this->_updateValidator($request->all());

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->all()[0], ExceptionCode::INVALID_REQ_PARAMS);
        }

        if (!is_null($request->json('licence'))) {
            $user = Auth::user();
            if ($user->getRole() != Role::OWNER) {
                throw new \Exception('Insufficient privilege for this operation');
            }
        }

        $this->_factoryService->updateFactory($request);

        return response()->api(true);
    }

    private function _validator(array $data) {
        return Validator::make($data, [
            'name'     => ['bail', 'required', 'string', 'max:50'],
            'address'  => ['bail', 'required', 'string', 'max:255'],
            'licence'  => ['bail', 'required', 'boolean'],
            'phone'    => ['bail', 'nullable', 'string', 'max:25'],
            'info'     => ['bail', 'nullable', 'string', 'max:255']
        ]);
    }

    private function _updateValidator(array $data) {
        return Validator::make($data, [
            'id'       => ['bail', 'required', 'numeric'],
            'name'     => ['bail', 'string', 'max:50'],
            'address'  => ['bail', 'string', 'max:255'],
            'licence'  => ['bail', 'boolean'],
            'phone'    => ['bail', 'string', 'max:25'],
            'info'     => ['bail', 'string', 'max:255']
        ]);
    }
}
