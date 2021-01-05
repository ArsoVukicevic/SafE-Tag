<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Service;

use App\Exceptions\ExceptionCode;
use App\Model\DAO\Role as RoleModel;
use App\Type\CacheKeys;
use App\Type\Role;
use Illuminate\Support\Facades\Cache;

/**
 * Description of RoleService
 *
 * @author milos
 */
class RoleService {

    public function getRoles() {
        return $this->_loadRoles();
    }

    public function getAvailableRoles($roleId) {
        switch ($roleId) {
            case Role::OWNER:
                return $this->_ownerAvailableRoles();
            case Role::ADMIN:
                return $this->_adminAvailableRoles();
            default:
                throw new \Exception('Role not Available', ExceptionCode::ROLE_NOT_AVAILABLE);
        }
    }

    private function _ownerAvailableRoles() {
        $roles = $this->_loadRoles();
        $response = [];
        $response[] = $roles[Role::ADMIN];

        return $response;
    }

    private function _adminAvailableRoles() {
        $roles = $this->_loadRoles();

        $response = [];
        $response[] = $roles[Role::MANAGER];
        $response[] = $roles[Role::EMPLOYEE];

        return $response;
    }

        //@TODO add into cache
    private function _loadRoles() {
        return Cache::rememberForever(CacheKeys::ROLES, function () {
            $roles = RoleModel::orderBy('r_id')->get();

            $response = [];
            foreach ($roles as $role) {
                $r = new \stdClass();
                $r->id = $role->r_id;
                $r->name = $role->r_name;

                $response[$role->r_id] = $r;
            }

            return $response;
        });
    }
}
