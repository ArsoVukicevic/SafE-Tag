<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\Response;

/**
 * Description of TraitName
 *
 * @author milos
 */
trait TraitName {
    private $name;

    function getName() {
        return $this->name;
    }

    function setName($name) {
        $this->name = $name;
    }
}
