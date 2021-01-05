<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\Response;

/**
 * Description of UserResponse
 *
 * @author milos
 */
class UserResponse implements \JsonSerializable {

    use TraitID;
    use TraitName;

    private $workingPlace;
    private $lastname;
    private $email;
    private $phone;
    private $factory;
    private $role;
    private $roleId;
    private $isActive;

    public function getWorkingPlace() {
        return $this->workingPlace;
    }

    public function getLastname() {
        return $this->lastname;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getPhone() {
        return $this->phone;
    }

    public function getFactory() {
        return $this->factory;
    }

    public function getRole() {
        return $this->role;
    }

    public function getRoleId() {
        return $this->roleId;
    }

    public function getIsActive() {
        return $this->isActive;
    }

    public function setWorkingPlace($workingPlace) {
        $this->workingPlace = $workingPlace;
    }

    public function setLastname($lastname) {
        $this->lastname = $lastname;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setPhone($phone) {
        $this->phone = $phone;
    }

    public function setFactory($factory) {
        $this->factory = $factory;
    }

    public function setRole($role) {
        $this->role = $role;
    }

    public function setRoleId($roleId) {
        $this->roleId = $roleId;
    }

    public function setIsActive($isActive) {
        $this->isActive = $isActive;
    }

    public function jsonSerialize() {
        return array(
            'id'       => $this->getId(),
            'name'     => $this->getName(),
            'lastname' => $this->lastname,
            'email'    => $this->email,
            'workingPlace' => $this->workingPlace,
            'phone'    => $this->phone,
            'factory'  => $this->factory,
            'role'     => $this->role,
            'roleId'   => $this->roleId,
            'isActive' => $this->isActive,
        );
    }
}
