<?php

namespace App\Adapter;

use App\Model\Response\FactoryResponse;
use App\Model\Response\UserResponse;
use App\Service\FactoryService;
use App\Service\RoleService;
use App\User;

/**
 * Description of UserAdapter
 *
 * @author milos
 */
class UserAdapter {

    private $_factories;
    private $_roles;

    public function __construct(FactoryService $factoryService, RoleService $roleService) {
        $this->_factories = $factoryService->getFactories();
        $this->_roles = $roleService->getRoles();
    }

    public function fromModelToResponse(User $u) : UserResponse {
        $role = $this->_roles[$u->getRole()];
        $factory = $this->_factories[$u->getFactoryId()];

        $userResponse = new UserResponse();
        $userResponse->setId($u->getId());
        $userResponse->setName($u->getName());
        $userResponse->setWorkingPlace($u->getWorkingPlace());
        $userResponse->setLastname($u->getLastname());
        $userResponse->setEmail($u->getEmail());
        $userResponse->setPhone($u->getPhone());
        $userResponse->setRoleId($u->getRole());
        $userResponse->setRole($role->name);
        $userResponse->setIsActive($u->isActive());

        $factoryResponse = new FactoryResponse();
        $factoryResponse->setName($factory->name);
        $factoryResponse->setLicencePaid($factory->licencePaid);
        $userResponse->setFactory($factory);

        return $userResponse;
    }
}
