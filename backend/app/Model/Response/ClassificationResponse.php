<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\Response;

/**
 * Description of ClassificationResponse
 * @TODO rename to ITEMS
 * @author milos
 */
class ClassificationResponse implements \JsonSerializable {
    use TraitID;
    use TraitName;

    private $parentId;
    private $rootId;
    private $desc;
    private $image;
    private $isActive;
    private $level = 1;
    private $childrens = [];

    public function getParentId() {
        return $this->parentId;
    }

    public function getRootId() {
        return $this->rootId;
    }

    public function getDesc() {
        return $this->desc;
    }

    public function getChildrens() {
        return $this->childrens;
    }

    public function getImage() {
        return $this->image;
    }

    public function getLevel() {
        return $this->level;
    }

    public function setDesc($desc) {
        $this->desc = $desc;
    }

    public function setIsActive($isActive) {
        $this->isActive = $isActive;
    }

    public function setChildrens($childrens) {
        $this->childrens = $childrens;
    }

    public function addChildren($children) {
        $this->childrens[] = $children;
    }

    public function setParentId($parentId) {
        $this->parentId = $parentId;
    }

    public function setRootId($rootId) {
        $this->rootId = $rootId;
    }

    public function setImage($image) {
        $this->image = $image;
    }

    public function setLevel($level) {
        $this->level = $level;
    }

    public function jsonSerialize() {
        $data = array(
            'key'       => $this->getId(),
            'name'      => $this->getName(),
            'desc'      => $this->desc,
            'isItemActive'  => $this->isActive,//isActive is reserved word
            'nodes' => $this->childrens,
            'level' => $this->level,
        );
        if ($this->image) {
            $data['image'] = $this->image;
        }

        return $data;
    }
}
