<?php
namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;


class Factory extends Model {
    protected $primaryKey = 'f_id';
    protected $table = DB::FACTORIES;
    public $timestamps = false;
    public $incrementing = false;

    public function getId() {
        return $this->f_id;
    }

    public function getName() {
        return $this->f_name;
    }

    public function getAddress() {
        return $this->f_address;
    }

    public function getPhone() {
        return $this->f_phone;
    }

    public function getLicencePaid() {
        return $this->f_licence_paid;
    }

    public function getInfo() {
        return $this->f_info;
    }
}


