<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

class Massage extends Model
{

    const ID = 'ms_id';
    const MSG = 'ms_msg';
    const TYPE = 'ms_mst_id';
    const USER_ID = 'ms_u_id';
    const TAG_ID = 'ms_t_id';

    protected $primaryKey = self::ID;
    protected $table = DB::MESSAGES;
    public $timestamps = false;
    public $incrementing = false;


    public function getId()
    {
        return $this->ms_id;
    }

    public function getMsg()
    {
        return $this->ms_msg;
    }

    public function getType()
    {
        return $this->ms_mst_id;
    }

    public function getUserId()
    {
        return $this->ms_u_id;
    }

    public function getTagId()
    {
        return $this->ms_t_id;
    }

    public function setId($id)
    {
        $this->ms_id = $id;
    }

    public function setMsg($msg)
    {
        $this->ms_msg = $msg;
    }

    public function setType($type)
    {
        $this->ms_mst_id = $type;
    }

    public function setUserId($userId)
    {
        $this->ms_u_id = $userId;
    }

    public function setTagId($tagId)
    {
        $this->ms_t_id = $tagId;
    }
}
