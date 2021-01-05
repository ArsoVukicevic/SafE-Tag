<?php

namespace App\Service;

use App\Type\CacheKeys;
use App\Type\Role;
use App\User;
use Illuminate\Support\Facades\Cache;

class EmployeesService
{

    /**
     * @return User[]
     */
    public function getEmployeesForAssign()
    {
        return $this->_loadEmployees();
    }

    public function getEmployeesForAudit()
    {
        $employees = $this->_loadEmployees();

        $response = [];
        foreach ($employees as $employee) {
            $user['id'] = $employee->getId();
            $user['name'] = $employee->getName() . ' ' . $employee->getLastname();
            $response[] = $user;
        }

        return $response;
    }

    public function getMaganers()
    {
        $factoryId = User::factoryId();
        $cacheKey = CacheKeys::FACTORY_MANAGERS . '_' . $factoryId;
        return Cache::rememberForever($cacheKey, function () use ($factoryId) {
            $managers = User::where(User::ROLE, Role::MANAGER)
                ->where(User::FACTORY_ID, $factoryId)
                ->where(User::IS_ACTIVE, true)
                ->get();

            $response = [];
            foreach ($managers as $manager) {
                $response[] = $manager->getId();
            }

            return $response;
        });
    }

    private function _loadEmployees()
    {
        $factoryId = User::factoryId();
        $cacheKey = CacheKeys::FACTORY_EMPLOYEES . '_' . $factoryId;
        return Cache::rememberForever($cacheKey, function () use ($factoryId) {
            $employees = User::whereNotIn(User::ROLE, [Role::OWNER, Role::ADMIN])
                ->where(User::FACTORY_ID, $factoryId)
                ->where(User::IS_ACTIVE, true)
                ->get();

            return $employees;
        });
    }
}
