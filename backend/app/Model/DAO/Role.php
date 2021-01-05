<?php

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = DB::ROLES;
}
