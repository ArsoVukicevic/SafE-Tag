<?php

namespace App\Service;

use App\Model\DAO\Audit;
use App\Model\DAO\AuditFactoryItem;
use App\Model\DAO\FactoryItem;
use App\Type\AuditFactoryItemStatus;
use App\Type\AuditStatus;
use App\Type\CacheKeys;
use App\User;
use App\Constants\DB as DB_CONST;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuditService
{

    public function insertAudit($assignTo, $audit, $name)
    {
        $newAudit = $this->_removeParentsFromAudit($audit);

        try {
            DB::beginTransaction();
            $userId = Auth::user()->getId();
            $auditModel = new Audit();
            $auditModel->setCreatedBy($userId);
            $auditModel->setAssignBy($assignTo);
            $auditModel->setStatus(AuditStatus::OPEN);
            $auditModel->setName($name);
            $auditModel->save();

            $dataForInserts = [];
            $childrens = [];
            foreach ($newAudit as $a) {
                $dataForInsert = [
                    AuditFactoryItem::AUDIT_ID => $auditModel->getId(),
                    AuditFactoryItem::FACTORY_ITEM_ID => $a['treeHistoryChild'],
                    AuditFactoryItem::TREE_HISTORY => $a['treeHistory'],
                    AuditFactoryItem::STATUS => AuditFactoryItemStatus::UNCHECKED,
                ];

                $dataForInserts[] = $dataForInsert;

                //prepare data for return
                $treeHistory = explode('/', $a['treeHistory']);
                $childrens = array_merge($childrens, $treeHistory);
            }

            AuditFactoryItem::insert($dataForInserts);
            DB::commit();

            Cache::forget(CacheKeys::GET_DASHBOARD_AUDIT . '_' . User::factoryId());
            Cache::forget(CacheKeys::GET_AUDIT . '_' . $assignTo);

            $responseItems = [];
            $childrens = array_unique($childrens);
            foreach ($childrens as $c) {
                $data['status'] = AuditFactoryItemStatus::UNCHECKED;
                $data['id'] = $c;
                $responseItems[] = $data;
            }

            $response = [];
            $response[$assignTo][$auditModel->getId()]['name'] = $name;
            $response[$assignTo][$auditModel->getId()]['status'] = AuditStatus::getName(
                AuditStatus::OPEN
            );
            $response[$assignTo][$auditModel->getId()]['items'] = $responseItems;

            return $response;
        } catch (\Exception $ex) {
            DB::rollBack();
            \Log::error($ex);
            throw new \Exception('Generic Error!');
        }
    }

    public function getDashboardAudit(FactoryItemService $itemService)
    {
        $cacheKey = CacheKeys::GET_DASHBOARD_AUDIT . '_' . User::factoryId();
        return Cache::rememberForever($cacheKey, function () use ($itemService) {
            return $this->_loadDashboardAudit($itemService);
        });
    }

    private function _loadDashboardAudit($itemService)
    {
        /**
         * @var $rs AuditFactoryItem[]
         */
        $rs = AuditFactoryItem::join(DB_CONST::AUDIT, Audit::ID, AuditFactoryItem::AUDIT_ID)
            ->join(DB_CONST::FACTORY_ITEMS, FactoryItem::ID, AuditFactoryItem::FACTORY_ITEM_ID)
            ->where(FactoryItem::FACTORY_ID, User::factoryId())
            ->whereIn(Audit::STATUS, [AuditStatus::OPEN, AuditStatus::CLOSE])
            ->orderBy(AuditFactoryItem::AUDIT_ID)
            ->get();

        $auditsPerUser = [];
        $auditData = [];
        foreach ($rs as $record) {
            $auditData[$record->getAuditId()]['name'] = $record->a_name;
            $auditData[$record->getAuditId()]['status'] = AuditStatus::getName($record->a_status);
            $auditsPerUser[$record->a_assign_to][$record->afi_a_id][] = $record;
        }

        $itemsPerUser = [];
        foreach ($auditsPerUser as $assignTo => $auditsItems) {
            $childrens = [];
            $status = [];

            foreach ($auditsItems as $auditId => $auditItems) {
                $childrens[$auditId] = [];

                foreach ($auditItems as $auditItem) {
                    $treeHistory = explode('/', $auditItem->getTreeHistory());
                    $childrens[$auditId] = array_merge($childrens[$auditId], $treeHistory);
                    $status[$auditId][$auditItem->getFactoryItemId()] = $auditItem->getStatus();
                }
            }

            foreach ($childrens as $auditId => $value) {
                $items = $itemService->getAuditItemsTree(
                    array_unique($value),
                    $status[$auditId]
                );

                $this->_populateAuditStatus($items);

                $itemsPerUser[$assignTo][$auditId] = $items;
            }
        }

        $response = [];
        foreach ($itemsPerUser as $userId => $itemsPerAudit) {
            foreach ($itemsPerAudit as $auditId => $items) {

                $responseAudit['name'] = $auditData[$auditId]['name'];
                $responseAudit['status'] = $auditData[$auditId]['status'];
                $responseItems = [];
                $this->_packDashboardAudit($items, $responseItems);

                $response[$userId][$auditId] = $responseAudit;
                $response[$userId][$auditId]['items'] = $responseItems;
            }
        }

        return $response;
    }

    public function getAudit()
    {
        $userId = Auth::user()->getId();
        $cacheKey = CacheKeys::GET_AUDIT . '_' . $userId;
        return Cache::remember(
            $cacheKey,
            86400,//one day
            function () use ($userId) {
                return $this->_loadAppAudit($userId);
            }
        );
    }

    private function _loadAppAudit($userId)
    {
        /**
         * @var $openAudit Audit
         */
        $openAudit = Audit::where(Audit::STATUS, AuditStatus::OPEN)
            ->where(Audit::ASSIGN_TO, $userId)
            ->orderBy(Audit::ID)
            ->first();
        if (is_null($openAudit)) {
            return [
                'audit' => [],
                'auditCount' => 0
            ];
        }

        $rs = AuditFactoryItem::where(AuditFactoryItem::AUDIT_ID, $openAudit->getId())->get();

        $childrens = [];
        $status = [];

        foreach ($rs as $record) {
            $treeHistory = explode('/', $record->getTreeHistory());
            $childrens = array_merge($childrens, $treeHistory);
            $status[$record->getFactoryItemId()] = $record->getStatus();
        }

        $itemService = new FactoryItemService();
        $items = $itemService->getAuditItemsTree(
            array_unique($childrens),
            $status
        );

        $this->_populateAuditStatus($items);

        return [
            'audit' => $items,
            'auditId' => $openAudit->getId(),
            //audit to be checked count
            'auditCount' => count($rs)
        ];
    }

    public function closeAudit($auditRequest, $auditId)
    {
        $accumulateData = [];
        $this->_extractDataForClosingAudit($auditRequest, $accumulateData);

        $notCheckedItem = array_filter($accumulateData, function ($itemStatus) {
            return $itemStatus == 0;
        });
        if (count($notCheckedItem) > 0 || empty($accumulateData)) {
            throw new \Exception('Item not checked');
        }

        $audit = Audit::where(Audit::ID, $auditId)
            ->where(Audit::STATUS, AuditStatus::OPEN)
            ->first();

        if (is_null($audit)) {
            throw new \Exception('Audit doesn\'t exist!');
        }

        try {
            DB::beginTransaction();

            foreach ($accumulateData as $factoryItemId => $status) {
                AuditFactoryItem::where(AuditFactoryItem::FACTORY_ITEM_ID, $factoryItemId)
                    ->where(AuditFactoryItem::AUDIT_ID, $auditId)
                    ->update([AuditFactoryItem::STATUS => $status]);
            }

            $audit->setStatus(AuditStatus::CLOSE);
            $audit->save();

            DB::commit();

            /** @var $user User */
            $user = Auth::user();
            $factoryId = CacheKeys::GET_DASHBOARD_AUDIT . '_' . $user->getFactoryId();
            $userId = CacheKeys::GET_AUDIT . '_' . $user->getId();
            Cache::forget(CacheKeys::GET_DASHBOARD_AUDIT . '_' . $factoryId);
            Cache::forget(CacheKeys::GET_AUDIT . '_' . $userId);
        } catch (\Exception $ex) {
            DB::rollBack();
            Log::error($ex);
            throw $ex;
        }

        return true;
    }

    /**
     * Remove parent without children.
     * $audit look like 38, 38/40, 38/40/42 and items 38, 38/40 will be skipped
     */
    private function _removeParentsFromAudit($audit)
    {
        $response = [];
        foreach ($audit as $a) {
            $exist = $this->_parentExist($audit, $a);

            if (!$exist) {
                $treeHistory = explode('/', $a);

                $response[] = [
                    'treeHistory' => $a,
                    'treeHistoryChild' => end($treeHistory)
                ];
            }
        }

        return $response;
    }

    private function _parentExist($haystack, $lookingFor)
    {
        for ($j = 0; $j < count($haystack); $j++) {
            $myAudit = $haystack[$j];

            if ($lookingFor != $myAudit && strpos($myAudit, $lookingFor) !== false) {
                return 1;//exist
            }
        }
        return 0;//not exist
    }

    private function _populateAuditStatus(array $items)
    {
        $statusCount = [];
        foreach ($items as $item) {
            if (!empty($item->getChildrens())) {
                $item->setStatus($this->_populateAuditStatus($item->getChildrens()));
            }

            $statusCount[$item->getStatus()][] = 1;
        }

        //parent status priority
        if (isset($statusCount[AuditFactoryItemStatus::NOT_OK])) {
            return AuditFactoryItemStatus::NOT_OK;
        } else if (isset($statusCount[AuditFactoryItemStatus::UNCHECKED])) {
            return AuditFactoryItemStatus::UNCHECKED;
        } else {
            return AuditFactoryItemStatus::OK;
        }
    }

    private function _packDashboardAudit($items, &$response)
    {
        foreach ($items as $item) {
            if (!empty($item->getChildrens())) {
                $this->_packDashboardAudit($item->getChildrens(), $response);
            }
            $responseData['status'] = $item->getStatus();
            $responseData['id'] = $item->getId();

            $response[] = $responseData;
        }
    }

    private function _extractDataForClosingAudit($auditRequest, &$accumulateData)
    {
        foreach ($auditRequest as $a) {
            if (!empty($a['nodes'])) {
                $this->_extractDataForClosingAudit($a['nodes'], $accumulateData);
            } else {
                //only nodes without child can be tested into audit
                $accumulateData[$a['key']] = $a['status'];
            }
        }
    }
}
