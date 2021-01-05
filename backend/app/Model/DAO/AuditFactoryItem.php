<?php

namespace App\Model\DAO;

use App\Constants\DB;
use Illuminate\Database\Eloquent\Model;


class AuditFactoryItem extends Model {

    const FACTORY_ITEM_ID = 'afi_fi_id';
    const AUDIT_ID = 'afi_a_id';
    const DESC = 'afi_desc';
    const TREE_HISTORY = 'afi_tree_history';
    const STATUS = 'afi_status';

    protected $primaryKey = [self::FACTORY_ITEM_ID, self::AUDIT_ID];
    protected $table = DB::AUDIT_FACTORY_ITEMS;
    public $timestamps = false;
    public $incrementing = false;

    public function getFactoryItemId() {
        return $this->afi_fi_id;
    }

    public function getAuditId() {
        return $this->afi_a_id;
    }

    public function getDesc() {
        return $this->afi_desc;
    }

    public function setFactoryItemId($factoryItemId) {
        $this->afi_fi_id = $factoryItemId;
    }

    public function setAuditId($auditId) {
        $this->afi_a_id = $auditId;
    }

    public function setDesc($desc) {
        $this->afi_desc = $desc;
    }

    public function getTreeHistory() {
        return $this->afi_tree_history;
    }

    public function setTreeHistory($treeHistory) {
        $this->afi_tree_history = $treeHistory;
    }

    public function getStatus() {
        return $this->afi_status;
    }

    public function setStatus($status) {
        $this->afi_status = $status;
    }
}
