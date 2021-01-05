<?php
namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

class Classification extends Model {

    const ID = 'c_id';
    const IS_ACTIVE = 'c_is_active';

    protected $primaryKey = self::ID;
    protected $table = DB::CLASSIFICATIONS;
    public $timestamps = false;
    public $incrementing = false;

    public function getId() {
        return $this->c_id;
    }

    public function getParentId() {
        return $this->c_parent_id;
    }

    public function getRootId() {
        return $this->c_root_id;
    }

    public function getName() {
        return $this->c_name;
    }

    public function getType() {
        return $this->c_ct_id;
    }

    public function getDesc() {
        return $this->c_desc;
    }

    public function isActive() {
        return $this->c_is_active;
    }
}
