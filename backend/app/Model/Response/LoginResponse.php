<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\Response;

/**
 * Description of LoginResponse
 *
 * @author milos
 */
class LoginResponse implements \JsonSerializable
{

    use TraitID;

    private $_role;
    private $_token;
    private $_fullName;
    private $_additionData;

    public function getRole()
    {
        return $this->_role;
    }

    public function getToken()
    {
        return $this->_token;
    }

    public function setRole($role)
    {
        $this->_role = $role;
    }

    public function setToken($token)
    {
        $this->_token = $token;
    }

    public function getAdditionData()
    {
        return $this->_additionData;
    }

    public function setAdditionData($additionData)
    {
        $this->_additionData = $additionData;
    }

    /**
     * @return string
     */
    public function getFullName()
    {
        return $this->_fullName;
    }

    /**
     * @param string $fullName
     */
    public function setFullName($fullName): void
    {
        $this->_fullName = $fullName;
    }


    public function jsonSerialize()
    {
        return array(
            'id' => $this->getId(),
            'role' => $this->getRole(),
            'token' => $this->_token,
            'fullName' => $this->_fullName,
            'additionData' => $this->_additionData
        );
    }
}
