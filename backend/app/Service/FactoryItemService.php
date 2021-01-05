<?php


namespace App\Service;

use App\Adapter\ClassificationItemsAdapter as Adapter;
use App\Exceptions\ExceptionCode;
use App\Model\DAO\FactoryItem;
use App\Model\Response\ClassificationResponse;
use App\Type\CacheKeys;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class FactoryItemService
{

    private $_adapter;

    public function __construct()
    {
        $this->_adapter = new Adapter();
    }

    public function insertItems(Request $request)
    {
        $factoryId = User::factoryId();
        $parentId = null;
        $rootId = null;
        if ($request->json('parentId')) {
            $parentId = $request->json('parentId');
            $fItem = FactoryItem::where('fi_id', '=', $parentId)
                ->where('fi_f_id', '=', $factoryId)
                ->first();
            if (!$fItem) {
                throw new \Exception('Parent id doesn\'t exist', ExceptionCode::PARENT_ID_NOT_EXIST);
            }

            $rootId = is_null($fItem->getRootId()) ? $parentId : $fItem->getRootId();
        }

        $imageName = null;
        if ($request->get('imageAsDataURL')) {
            $imageService = new ImageService();
            $imageName = $imageService->save($request->get('imageAsDataURL'));
        }

        $factoryItem = new FactoryItem();
        $factoryItem->fi_parent_id = $parentId;
        $factoryItem->fi_f_id = $factoryId;
        $factoryItem->fi_image = $imageName;
        $factoryItem->fi_code_desc = $request->json('codeDesc');
        $factoryItem->fi_desc = $request->json('desc');
        $factoryItem->fi_root_id = $rootId;
        $factoryItem->fi_is_active = true;
        $factoryItem->save();
        $factoryItem->fi_id = DB::getPdo()->lastInsertId();

        Cache::forget(CacheKeys::ITEMS_TREE . '_' . $factoryId);
        Cache::forget(CacheKeys::ITEMS_TREE . '_active_' . $factoryId);

        return $this->_adapter->fromItemModelToResponse($factoryItem);
    }

    public function getItems($isActive = null)
    {
        $query = FactoryItem::where('fi_f_id', User::factoryId());
        if ($isActive) {
            $query->where(FactoryItem::IS_ACTIVE, true);
        }
        $factoryItems = $query->orderBy('fi_parent_id')->get();

        if ($factoryItems->count() === 0) {
            return [];
        }

        $adaptedModels = [];
        foreach ($factoryItems as $factoryItem) {
            $adaptedModels[] = $this->_adapter->fromItemModelToResponse($factoryItem);
        }

        return $adaptedModels;
    }

    public function getAuditItemsTree(array $factoryItemIds, $status)
    {
        $factoryItems = FactoryItem::where('fi_f_id', User::factoryId())
            ->whereIn('fi_id', $factoryItemIds)
            ->orderBy('fi_parent_id')
            ->get();

        if ($factoryItems->count() === 0) {
            return [];
        }

        $adaptedModels = [];
        foreach ($factoryItems as $factoryItem) {
            $adaptedModels[] = $this->_adapter->fromItemModelToAuditResponse(
                $factoryItem, $status
            );
        }

        return $this->_populateChildrens($adaptedModels);
    }

    public function getItemsTree()
    {
        $cacheKey = CacheKeys::ITEMS_TREE . '_' . User::factoryId();
        return Cache::rememberForever($cacheKey, function () {
            return $this->_loadItemsTree();
        });
    }

    public function getActiveItemsTree()
    {
        $cacheKey = CacheKeys::ITEMS_TREE . '_active_' . User::factoryId();
        return Cache::rememberForever($cacheKey, function () {
            return $this->_loadItemsTree(true);
        });
    }

    public function updateItem(Request $request)
    {
        $columnsForUpdate = [];

        if ($request->json('name')) {
            $columnsForUpdate['fi_code_desc'] = $request->json('name');
        }
        if ($request->json('desc')) {
            $columnsForUpdate['fi_desc'] = $request->json('desc');
        }
        if ($request->get('imageAsDataURL')) {
            $imageService = new ImageService();
            $imageName = $imageService->save($request->get('imageAsDataURL'));
            $columnsForUpdate['fi_image'] = $imageName;
        }

        $itemId = $request->json('id');
        if (!empty($columnsForUpdate)) {
            FactoryItem::where(FactoryItem::ID, $itemId)
                ->update($columnsForUpdate);
        }

        $isActive = $request->json('isActive');
        if (!is_null($isActive)) {
            $mai = new UpdateIsActiveItem();
            $mai->factoryItem(
                $this->getItemsTree(), $itemId, $isActive
            );
        }

        Cache::forget(CacheKeys::ITEMS_TREE . '_' . User::factoryId());
        Cache::forget(CacheKeys::ITEMS_TREE . '_active_' . User::factoryId());
    }

    private function _loadItemsTree($isActive = null)
    {
        $items = $this->getItems($isActive);

        return $this->_populateChildrens($items);
    }

    /**
     *
     * @param ClassificationResponse $responseModels
     */
    private function _populateChildrens($responseModels)
    {
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
