<?php


namespace App\Adapter;

use App\Model\DAO\Factory;
use App\Model\Response\FactoryResponse;

class FactoryAdapter {
    public function fromModelToResponse(Factory $f) : FactoryResponse {

        $factoryResponse = new FactoryResponse();
        $factoryResponse->setId($f->getId());
        $factoryResponse->setInfo($f->getInfo());
        $factoryResponse->setAddress($f->getInfo());
        $factoryResponse->setName($f->getName());
        $factoryResponse->setPhone($f->getPhone());
        $factoryResponse->setLicencePaid($f->getLicencePaid());

        return $factoryResponse;
    }
}
