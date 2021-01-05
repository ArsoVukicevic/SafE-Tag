<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

class Config extends Model
{
    protected $primaryKey = 'c_param';
    protected $table = DB::CONFIGS;
    public $timestamps = false;
    public $incrementing = false;

    public function getParam()
    {
        return $this->c_param;
    }

    public function getValue()
    {
        return $this->c_value;
    }

    public function setParam($param)
    {
        $this->c_param = $param;
    }

    public function setValue($value)
    {
        $this->c_value = $value;
    }
}
