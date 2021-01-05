<?php

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

class UserSession extends Model
{

    const ID = 'us_id';
    const USER_ID = 'us_u_id';
    const TOKEN = 'us_token';
    const IS_MOBILE = 'us_is_mobile';
    const START_DT = 'us_startdt';
    const END_DT = 'us_enddt';

    protected $primaryKey = 'us_id';
    protected $table = DB::USER_SESSIONS;
    public $timestamps = false;
    public $incrementing = false;

    public function getId()
    {
        return $this->us_id;
    }

    public function getUserId()
    {
        return $this->us_u_id;
    }

    public function getToken()
    {
        return $this->us_token;
    }

    public function getIsMobile()
    {
        return $this->us_is_mobile;
    }

    public function getStartDt()
    {
        return $this->us_startdt;
    }

    public function getEndDt()
    {
        return $this->us_enddt;
    }

    public function setId($id)
    {
        $this->us_id = $id;
    }

    public function setUserId($userId)
    {
        $this->us_u_id = $userId;
    }

    public function setToken($token)
    {
        $this->us_token = $token;
    }

    public function setIsMobile($isMobile)
    {
        $this->us_is_mobile = $isMobile;
    }

    public function setStartDt($startDt)
    {
        $this->us_startdt = $startDt;
    }

    public function setEndDt($endDt)
    {
        $this->us_enddt = $endDt;
    }
}
