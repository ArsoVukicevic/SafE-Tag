<?php

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;

class FactoryItem extends Model
{

    const ID = 'fi_id';
    const FACTORY_ID = 'fi_f_id';
    const IS_ACTIVE = 'fi_is_active';
    const TABLE = 'public.factory_items';

    protected $primaryKey = self::ID;
    protected $table = DB::FACTORY_ITEMS;
    public $timestamps = false;
    public $incrementing = false;

    public function getId()
    {
        return $this->fi_id;
    }

    public function getParentId()
    {
        return $this->fi_parent_id;
    }

    public function getRootId()
    {
        return $this->fi_root_id;
    }

    public function getCodeDesc()
    {
        return $this->fi_code_desc;
    }

    public function getFactory()
    {
        return $this->fi_f_id;
    }

    public function getDesc()
    {
        return $this->fi_desc;
    }

    public function getImage()
    {
        return $this->fi_image;
    }

    public function isActive()
    {
        return $this->fi_is_active;
    }
}
