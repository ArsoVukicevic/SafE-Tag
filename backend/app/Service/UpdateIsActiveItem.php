<?php

namespace App\Service;

use App\Model\DAO\Classification;
use App\Model\DAO\FactoryItem;

class UpdateIsActiveItem {

    const QT_FACTORY_ITEM = 1;
    const QT_CLASSIFICATION = 2;

    public function factoryItem($items, $itemId, $isActive) {
        $itemsForUpdate = $isActive
                ? $this->_getItemForActive($items, $itemId, self::QT_FACTORY_ITEM)
                : $this->_getItemForInActive($items, $itemId);

        FactoryItem::whereIn(FactoryItem::ID, $itemsForUpdate)
                ->update([FactoryItem::IS_ACTIVE => $isActive]);
    }

    public function classificationItem($items, $itemId, $isActive) {
        try {
            $itemsForUpdate = $isActive
                    ? $this->_getItemForActive($items, $itemId, self::QT_CLASSIFICATION)
                    : $this->_getItemForInActive($items, $itemId);

            Classification::whereIn(Classification::ID, $itemsForUpdate)
                    ->update([Classification::IS_ACTIVE => $isActive]);

            return true;
        } catch (\Exception $ex) {
            if ($ex->getCode() == -1100) {
                return false;
            }
            throw $ex;
        }
    }

    private function _getItemForInActive($items, $itemId) {
        $locatedItem = $this->_findItem($items, $itemId);
        if (empty($locatedItem)) {
            throw new \Exception('Item doesn\'t exist', -1100);
        }
        $listForUpdate = [$locatedItem->getId()];
        $this->_createListForUpdate($locatedItem->getChildrens(), $listForUpdate);

        return $listForUpdate;
    }

    private function _getItemForActive($items, $itemId, $queryType) {
        $locatedItem = $this->_findItem($items, $itemId);
        if (empty($locatedItem)) {
            throw new \Exception('Item doesn\'t exist');
        }

        if ($locatedItem->getParentId()) {
            $isParentActive = $queryType === self::QT_FACTORY_ITEM
                ? FactoryItem::where(FactoryItem::ID, $locatedItem->getParentId())
                    ->where(FactoryItem::IS_ACTIVE, true)
                    ->first()
                : Classification::where(Classification::ID, $locatedItem->getParentId())
                    ->where(Classification::IS_ACTIVE, true)
                    ->first();

            if (is_null($isParentActive)) {
                throw new \Exception('Parent item is not active');
            }
        }

        $listForUpdate = [$locatedItem->getId()];
        $this->_createListForUpdate($locatedItem->getChildrens(), $listForUpdate);

        return $listForUpdate;
    }

    private function _findItem($items, $itemId) {
        foreach ($items as $item) {
            if ($item->getId() == $itemId) {
                return $item;
            }

            if ($item->getChildrens()) {
                return $this->_findItem($item->getChildrens(), $itemId);
            }
        }

        return [];
    }

    private function _createListForUpdate($parentItem, &$listForUpdate) {

        foreach ($parentItem as $childrenItem) {
            if (!empty($childrenItem->getChildrens())) {
                $this->_createListForUpdate($childrenItem->getChildrens(), $listForUpdate);
            }
            $listForUpdate[] = $childrenItem->getId();
        }
    }
}
