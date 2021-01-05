<?php
namespace App\Adapter;

use App\Model\DAO\Classification;
use App\Model\DAO\FactoryItem;
use App\Model\Response\ClassificationResponse;
use App\Model\Response\AuditResponse;


class ClassificationItemsAdapter {

    public function fromModelToResponse(Classification $c) : ClassificationResponse {
        $response = new ClassificationResponse();
        $response->setId($c->getId());
        $response->setParentId($c->getParentId());
        $response->setRootId($c->getRootId());
        $response->setName($c->getName());
        $response->setDesc($c->getDesc());
        $response->setIsActive($c->isActive());

        return $response;
    }

    public function fromItemModelToResponse(FactoryItem $fi) : ClassificationResponse {
        $response = new ClassificationResponse();
        $response->setId($fi->getId());
        $response->setParentId($fi->getParentId());
        $response->setRootId($fi->getRootId());
        $response->setName($fi->getCodeDesc());
        $response->setDesc($fi->getDesc());
        $response->setImage($fi->getImage());
        $response->setIsActive($fi->isActive());

        return $response;
    }

    public function fromItemModelToAuditResponse(FactoryItem $fi, $status) : AuditResponse {
        $response = new AuditResponse();
        $response->setId($fi->getId());
        $response->setParentId($fi->getParentId());
        $response->setRootId($fi->getRootId());
        $response->setName($fi->getCodeDesc());
        $response->setDesc($fi->getDesc());
        $response->setImage($fi->getImage());
        $response->setStatus($status[$fi->getId()] ?? null);

        return $response;
    }
}
