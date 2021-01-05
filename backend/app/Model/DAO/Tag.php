<?php

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{

    const ID = 't_id';
    const STATUS = 't_ts_id';
    const FACTORY = 't_f_id';
    const ASSIGN_TO = 't_assign_to';
    const CREATE_BY = 't_create_by';
    const MANAGER = 't_manager';
    const END_DT = 't_enddt';
    const INDT_DT = 't_indt';

    protected $primaryKey = self::ID;
    protected $table = DB::TAGS;
    public $timestamps = false;
    public $incrementing = true;

    public function getId()
    {
        return $this->t_id;
    }

    public function getClassificationId()
    {
        return $this->t_c_id;
    }

    public function getCreatedBy()
    {
        return $this->t_create_by;
    }

    public function getAssignTo()
    {
        return $this->t_assign_to;
    }

    public function getManager()
    {
        return $this->t_manager;
    }

    public function getStatus()
    {
        return $this->t_ts_id;
    }

    public function getFactoryId()
    {
        return $this->t_f_id;
    }

    public function getRiskLevel()
    {
        return $this->t_rist_level;
    }

    public function getEndDt()
    {
        return $this->t_enddt;
    }

    public function getInDt()
    {
        return $this->t_indt;
    }

    public function getItemId()
    {
        return $this->t_fi_id;
    }

    public function setId($id)
    {
        $this->t_id = $id;
    }

    public function setClassificationId($classificationId)
    {
        $this->t_c_id = $classificationId;
    }

    public function setCreatedBy($createdBy)
    {
        $this->t_create_by = $createdBy;
    }

    public function setAssignTo($assignTo)
    {
        $this->t_assign_to = $assignTo;
    }

    public function setManager($manager)
    {
        $this->t_manager = $manager;
    }

    public function setStatus($status)
    {
        $this->t_ts_id = $status;
    }

    public function setFactoryId($factoryId)
    {
        $this->t_f_id = $factoryId;
    }

    public function setRiskLevel($riskLevel)
    {
        $this->t_rist_level = ceil($riskLevel);
    }

    public function setEndDt($endDt)
    {
        $this->t_enddt = $endDt;
    }

    public function setInDt($inDt)
    {
        $this->t_indt = $inDt;
    }

    public function setItemId($itemId)
    {
        $this->t_fi_id = $itemId;
    }
}
