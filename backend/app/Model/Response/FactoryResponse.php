<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\Response;


class FactoryResponse implements \JsonSerializable {

    use TraitID;
    use TraitName;

    private $phone;
    private $licencePaid;
    private $address;
    private $info;

    public function getPhone() {
        return $this->phone;
    }

    public function getLicencePaid() {
        return $this->licencePaid;
    }

    public function getAddress() {
        return $this->address;
    }

    public function getInfo() {
        return $this->info;
    }

    public function setPhone($phone) {
        $this->phone = $phone;
    }

    public function setLicencePaid($licencePaid) {
        $this->licencePaid = $licencePaid;
    }

    public function setAddress($address) {
        $this->address = $address;
    }

    public function setInfo($info) {
        $this->info = $info;
    }

    public function jsonSerialize() {
        $required = array(
            'id'       => $this->getId(),
            'name'     => $this->getName(),
            'phone'    => $this->phone,
            'licencePaid' => $this->licencePaid,
        );

        if ($this->address) {
            $required['address'] = $this->address;
        }
        if ($this->info) {
            $required['info'] = $this->info;
        }

        return $required;
    }
}
