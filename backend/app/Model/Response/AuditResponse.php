<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\Response;

/**
 * Description of AuditResponse
 *
 * @author milos
 */
class AuditResponse extends ClassificationResponse {
    private $status;
    public function getStatus() {
        return $this->status;
    }

    public function setStatus($status) {
        $this->status = $status;
    }

    public function jsonSerialize() {
        $parent = parent::jsonSerialize();
        $parent['status'] = $this->status;

        return $parent;
    }
}
