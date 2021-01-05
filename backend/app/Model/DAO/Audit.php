<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

/**
 * Description of Audit
 *
 * @author milos
 */
class Audit extends Model
{

    const ID = 'a_id';
    const CREATE_BY = 'a_create_by';
    const ASSIGN_TO = 'a_assign_to';
    const STATUS = 'a_status';
    const INDT = 'a_indt';

    protected $primaryKey = self::ID;
    protected $table = DB::AUDIT;
    public $timestamps = false;

    public function getId()
    {
        return $this->a_id;
    }

    public function getCreatedBy()
    {
        return $this->a_create_by;
    }

    public function getAssignBy()
    {
        return $this->a_assign_to;
    }

    public function getStatus()
    {
        return $this->a_status;
    }

    public function setId($id)
    {
        $this->a_id = $id;
    }

    public function setCreatedBy($createdBy)
    {
        $this->a_create_by = $createdBy;
    }

    public function setAssignBy($assignBy)
    {
        $this->a_assign_to = $assignBy;
    }

    public function setStatus($status)
    {
        $this->a_status = $status;
    }

    public function setName($name)
    {
        $this->a_name = $name;
    }
}
