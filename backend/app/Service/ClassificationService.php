<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Service;

use App\Adapter\ClassificationItemsAdapter as Adapter;
use App\Exceptions\ExceptionCode;
use App\Model\DAO\Classification;
use App\Model\Response\ClassificationResponse;
use App\Type\CacheKeys;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ClassificationService {

    private $_adapter;

    public function __construct() {
        $this->_adapter = new Adapter();
    }

    public function insertClassification(Request $request) {

        $factoryId = User::factoryId();
        $parentId = null;
        $rootId = null;
        $typeId = $request->json('typeId');
        if ($request->json('parentId')) {
            $parentId = $request->json('parentId');
            $exist = Classification::where('c_id', '=', $parentId)
                    ->where('c_ct_id', '=', $typeId)
                    ->where('c_f_id', '=', $factoryId)
                    ->first();
            if (!$exist) {
                throw new \Exception('Parent id doesn\'t exist', ExceptionCode::PARENT_ID_NOT_EXIST);
            }

            $rootId = is_null($exist->getRootId()) ? $parentId : $exist->getRootId();
        }

        $c = new Classification();
        $c->c_parent_id = $parentId;
        $c->c_desc      = $request->json('desc');
        $c->c_name      = $request->json('name');
        $c->c_ct_id     = $typeId;
        $c->c_f_id      = $factoryId;
        $c->c_root_id   = $rootId;
        $c->c_is_active = true;
        $c->save();
        $c->c_id = DB::getPdo()->lastInsertId();

        $cacheKey = CacheKeys::CLASSIFICATION_TREE . '_' . $factoryId;
        Cache::forget($cacheKey);


        return $this->_adapter->fromModelToResponse($c);
    }

    public function getClassification($isActive = null) {
        $factoryId = Auth::user()->getFactoryId();
        $query = Classification::where('c_f_id', $factoryId);
        if ($isActive) {
            $query->where(Classification::IS_ACTIVE, true);
        }
        $classifications = $query->orderBy('c_ct_id')
            ->orderBy('c_parent_id')
            ->get();

        if ($classifications->count() === 0) {
            return [];
        }

        $adaptedModels = [];
        foreach ($classifications as $classification) {
            $adaptedModel = $this->_adapter->fromModelToResponse($classification);
            $adaptedModels[$classification->getType()][] = $adaptedModel;
        }

        return $adaptedModels;
    }

    public function getClassificationTree() {
        $cacheKey = CacheKeys::CLASSIFICATION_TREE . '_' . User::factoryId();
        return Cache::rememberForever($cacheKey, function () {
            return $this->_loadClassificationTree();
        });
    }

    public function getActiveClassificationTree() {
        $cacheKey = CacheKeys::CLASSIFICATION_TREE . '_active_' . User::factoryId();
        return Cache::rememberForever($cacheKey, function () {
            return $this->_loadClassificationTree(true);
        });
    }

    public function updateClassification(Request $request) {

        $columnsForUpdate = [];

        if ($request->json('name')) {
            $columnsForUpdate['c_name'] = $request->json('name');
        }
        if ($request->json('desc')) {
            $columnsForUpdate['c_desc'] = $request->json('desc');
        }

        $itemId = $request->json('id');
        if (!empty($columnsForUpdate)) {
            Classification::where(Classification::ID, $itemId)
                    ->update($columnsForUpdate);
        }

        $isActive = $request->json('isActive');

        if (!is_null($isActive)) {
            $mai = new UpdateIsActiveItem();

            $classificationTree = $this->getClassificationTree();
            foreach ($classificationTree as $leaf) {
                $update = $mai->classificationItem(
                    $leaf, $itemId, $isActive
                );
                if ($update) {
                    break;
                }
            }
        }

        Cache::forget(CacheKeys::CLASSIFICATION_TREE . '_' . User::factoryId());
    }

    private function _loadClassificationTree($isActive = null) {
        $response = [];
        $classifications = $this->getClassification($isActive);

        foreach ($classifications as $typeId => $classification) {
            $response[$typeId] = $this->_populateChildrens($classification);
        }

        return $response;
    }

    /**
     *
     * @param ClassificationResponse $responseModels
     */
    private function _populateChildrens($responseModels) {
        foreach ($responseModels as $childModel) {
            if (!$childModel->getParentId()) {
                continue;
            }

            foreach ($responseModels as $parentModel) {
                if ($parentModel->getId() == $childModel->getParentId()) {
                    $childModel->setLevel($parentModel->getLevel() + 1);
                    $parentModel->addChildren($childModel);
                    break;
                }
            }
        }

        $response = [];
        foreach ($responseModels as $responseModel) {
            //Add only root elements
            if (is_null($responseModel->getParentId())) {
                $response[] = $responseModel;
            }
        }

        return $response;
    }
}
