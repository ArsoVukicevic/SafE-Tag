<?php

namespace App\Service;

use App\Model\DAO\Massage;
use App\Model\DAO\Tag;
use App\Type\CacheKeys;
use App\Type\MsgType;
use App\Type\TagStatus;
use App\User;
use App\Utils\Utils;
use App\Constants\DB as DB_CONST;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TagService
{

    const ACTION_OPENTAG = 1;
    const ACTION_ASSIGNTAG = 2;
    const ACTION_TASK_TO_ME = 'first';
    const FORWARD_TASK = 'second';

    public function openTag(Request $request)
    {
        $user = Auth::user();
        $userId = $user->getId();

        $tag = new Tag();

        $tag->setRiskLevel($request->json('riskLevel'));
        $tag->setClassificationId($request->json('classificationId'));
        $tag->setItemId($request->json('itemId'));
        $tag->setCreatedBy($userId);
        $tag->setFactoryId($user->getFactoryId());
        $this->_checkAndSetMode($tag, $userId, $request->json('mode'));

        try {
            DB::beginTransaction();

            $tag->save();

            $msgs = $request->json('msgs');
            if (isset($msgs)) {
                $this->_saveMsgs(
                    $msgs, $userId, $tag->getId(), self::ACTION_OPENTAG
                );
            }

            DB::commit();

            Cache::flush();

            if ($tag->getStatus() == TagStatus::OPEN) {
                $data = ['tagOpen' => true];
                ManagerNotify::notify(
                    'New task with id ' . $tag->getId() . ' is opened',
                    $data
                );
            }

            return true;
        } catch (\Exception $ex) {
            \Log::error($ex);
            DB::rollBack();
            throw new \Exception('Generic Error, please try again!');
        }
    }

    public function getTagsCount()
    {
        $response = new \stdClass();
        $response->openTagsCount = 0;
        $response->taskToDoCount = 0;
        $response->taskToDoAsignByMeCount = 0;

        $openTags = $this->getOpenTags();
        $taskToDo = $this->getTaskToDo();
        $taskToDoAsignByMe = $this->getTaskToDo(true);

        $response->openTagsCount = count($openTags);
        $response->taskToDoCount = count($taskToDo);
        $response->taskToDoAsignByMeCount = count($taskToDoAsignByMe);

        return $response;
    }

    public function getOpenTags()
    {
        $cacheKey = CacheKeys::OPEN_TAGS . '_' . User::factoryId();
        return Cache::rememberForever($cacheKey, function () {
            return $this->_loadOpenTags();
        });
    }


    public function _loadOpenTags()
    {
        $tags = Tag::where(Tag::STATUS, TagStatus::OPEN)
            ->where(Tag::FACTORY, User::factoryId())
            ->get();

        $response = [];
        foreach ($tags as $tag) {
            $details = $this->getOpenTagDetails($tag->getId());

            $r['id'] = $tag->getId();
            $r['classification'] = implode('->', $details->classification);
            $r['location'] = implode('->', $details->location);
            $r['classificationType'] = $details->classificationType;
            $r['risk'] = Utils::getRiskPercent($tag->getRiskLevel());
            $response[] = $r;
        }

        return $response;
    }

    public function getOpenTagDetails($tagId)
    {
        $cacheKey = CacheKeys::OPEN_TAG_DETAILS . '_' . User::factoryId() . '_' . $tagId;
        $tagDetails = Cache::remember(
            $cacheKey,
            86400,//one day
            function () use ($tagId) {
                return $this->_loadTagDetails($tagId);
            }
        );

        //User to who message should be sent
        $toUserId = Auth::user()->getId() == $tagDetails->assignToUserId
            ? $tagDetails->taskManager
            : $tagDetails->assignToUserId;

        if ($toUserId) {
            $tagDetails->toUser = $toUserId;
            $users = UserService::getAllUser(User::factoryId());

            $toUsernameModel = $users[$toUserId];
            $tagDetails->toUserName = $toUsernameModel->getName() . ' ' . $toUsernameModel->getLastname();

            $roleService = new RoleService();
            $roles = $roleService->getRoles();
            $tagDetails->toUserRole = $roles[$toUsernameModel->getRole()]->name;
        }

        return $tagDetails;
    }

    private function _loadTagDetails($tagId)
    {
        $factoryItemService = new FactoryItemService();
        $classificationService = new ClassificationService();

        $tag = DB::table(DB_CONST::TAGS)
            ->join(DB_CONST::CLASSIFICATIONS, 't_c_id', '=', 'c_id')
            ->join(DB_CONST::FACTORY_ITEMS, 't_fi_id', '=', 'fi_id')
            ->where('t_id', $tagId)
            ->select(
                't_rist_level', 't_assign_to', 't_create_by', 't_manager', 'fi_id',
                'fi_root_id', 'fi_image', 'c_id', 'c_ct_id', 'c_root_id'
            )
            ->first();

        if (!$tag) {
            throw new \Exception('Tag not exist!');
        }

        $itemRootId = is_null($tag->fi_root_id)
            ? $tag->fi_id
            : $tag->fi_root_id;
        $classificationsRootId = is_null($tag->c_root_id)
            ? $tag->c_id
            : $tag->c_root_id;

        $factoryItemTree = $factoryItemService->getItemsTree();
        $factoryItemBreadcrumbs = null;
        foreach ($factoryItemTree as $node) {
            if ($node->getId() == $itemRootId) {
                $breadcrumbsService = new BreadcrumbsService();
                $factoryItemBreadcrumbs = $breadcrumbsService->breadcrumbs(
                    $node, $tag->fi_id
                );
            }
        }

        $classificationTree = $classificationService->getClassificationTree();
        $classificationBreadcrumbs = null;
        foreach ($classificationTree[$tag->c_ct_id] as $node) {
            if ($node->getId() == $classificationsRootId) {
                $breadcrumbsService = new BreadcrumbsService();
                $classificationBreadcrumbs = $breadcrumbsService->breadcrumbs(
                    $node, $tag->c_id
                );
            }
        }
        /** @var $descMessages Massage[] */
        $descMessages = Massage::where(Massage::TAG_ID, $tagId)
            ->whereIn(Massage::TYPE, [MsgType::TEXT_DESC, MsgType::IMG_DESC])
            ->get();

        /** @var $instMessages Massage[] */
        $instMessages = Massage::where(Massage::TAG_ID, $tagId)
            ->whereIn(Massage::TYPE, [MsgType::TEXT_INSTRUCTION, MsgType::IMG_INSTRUCTION])
            ->get();

        $users = UserService::getAllUser(User::factoryId());
        $assignToUser = null;
        if ($tag->t_assign_to) {
            $assignToUserModel = $users[$tag->t_assign_to];
            $assignToUser = $assignToUserModel->getName() . ' ' . $assignToUserModel->getLastname();
        }

        $createdBy = null;
        if ($tag->t_create_by) {
            $createdBy = new \stdClass();
            $createdByUserModel = $users[$tag->t_create_by];
            $createdBy->name = $createdByUserModel->getName() . ' ' . $createdByUserModel->getLastname();

            $roleService = new RoleService();
            $roles = $roleService->getRoles();
            $createdBy->role = $roles[$createdByUserModel->getRole()]->name;
        }

        $response = new \stdClass();
        $response->tagId = $tagId;
        $response->toUser = null;
        $response->toUserName = null;
        $response->toUserRole = null;
        $response->assignToUserId = $tag->t_assign_to;
        $response->assignToUser = $assignToUser;
        $response->createdBy = $createdBy;
        $response->taskManager = $tag->t_manager;
        $response->risk = $tag->t_rist_level;
        $response->classification = $classificationBreadcrumbs;
        $response->classificationType = $tag->c_ct_id;
        $response->location = $factoryItemBreadcrumbs;
        $response->locationImg = $tag->fi_image;
        $response->description = [];
        $response->instractions = [];
        foreach ($descMessages as $descMessage) {
            $msgRes = new \stdClass();
            $msgRes->msg = $descMessage->getMsg();
            $msgRes->type = $descMessage->getType() == MsgType::TEXT_DESC
                ? MsgType::TEXT
                : MsgType::IMG;

            $response->description[] = $msgRes;
        }

        foreach ($instMessages as $instMessage) {
            $msgRes = new \stdClass();
            $msgRes->ui = $instMessage->getUserId();
            $msgRes->message = $instMessage->getMsg();
            $msgRes->type = $instMessage->getType() == MsgType::TEXT_INSTRUCTION
                ? MsgType::TEXT
                : MsgType::IMG;

            $response->instractions[] = $msgRes;
        }
        return $response;
    }

    public function getTaskToDo($assignByMe = null)
    {
        $userId = Auth::user()->getId();

        $cacheKey = $assignByMe
            ? CacheKeys::TASK_TO_DO . '_assignByMe_' . $userId
            : CacheKeys::TASK_TO_DO . '_' . $userId;

        return Cache::remember(
            $cacheKey,
            86400,//one day
            function () use ($assignByMe, $userId) {
                return $this->_loadTaskToDo($assignByMe, $userId);
            }
        );
    }

    private function _loadTaskToDo($assignByMe, $userId)
    {
        $tags = [];
        if ($assignByMe == true) {
            $tags = Tag::where(Tag::MANAGER, $userId)
                ->where(Tag::STATUS, TagStatus::ASSIGNED)
                ->get();
        } else {
            $tags = Tag::where(Tag::ASSIGN_TO, $userId)
                ->where(Tag::STATUS, TagStatus::ASSIGNED)
                ->get();
        }

        $response = [];
        foreach ($tags as $tag) {
            $details = $this->getOpenTagDetails($tag->getId());

            $r['id'] = $tag->getId();
            $r['classification'] = implode('->', $details->classification);
            $r['location'] = implode('->', $details->location);
            $r['classificationType'] = $details->classificationType;
            $r['risk'] = Utils::getRiskPercent($tag->getRiskLevel());
            $r['toUserName'] = $details->toUserName;
            $r['assignToUser'] = $details->assignToUser;
            $response[] = $r;
        }

        return $response;
    }

    public function resolveTask(Request $request)
    {
        try {
            DB::beginTransaction();
            $tagId = $request->json('tagId');
            $tag = Tag::find($tagId);
            $tag->setEndDt(Utils::getCurrentDate());
            $tag->setStatus(TagStatus::CLOSED);
            $tag->save();

            $this->_saveChatMsgs($tagId);
            DB::commit();

            Cache::forget(CacheKeys::TASK_TO_DO . '_assignByMe_' . $tag->getAssignTo());
            Cache::forget(CacheKeys::TASK_TO_DO . '_' . $tag->getAssignTo());
            Cache::forget(CacheKeys::TASK_TO_DO . '_assignByMe_' . $tag->getManager());
            Cache::forget(CacheKeys::TASK_TO_DO . '_' . $tag->getManager());
            Cache::forget(CacheKeys::ASSIGN_TAGS . '_' . User::factoryId());
            Cache::store('file')->forget('ws_msg_tag_' . $tagId);

            //if manager resolve own task skip sending notif in order to skip call twice api on FE side
            //to get taskCount
            if ($tag->getManager() != null) {
                $oneSignalService = new OneSignalService();
                $oneSignalService->sendNotif(
                    'Your task Tag#' . $tagId . ' has been resolved!',
                    [$tag->getAssignTo()],
                    ['taskResolved' => true]
                );
            }

            return $this->getTagsCount();
        } catch (\Exception $ex) {
            DB::rollBack();
            \Log::error($ex);
            throw new \Exception('Generic Error, please try again!');
        }
    }

    public function getAssignTags($factoryId)
    {
        $cacheKey = CacheKeys::ASSIGN_TAGS . '_' . $factoryId;
        return Cache::rememberForever($cacheKey, function () use ($factoryId) {
            return $this->_loadAssignTags($factoryId);
        });
    }

    private function _loadAssignTags($factoryId)
    {
        $tags = Tag::where(Tag::STATUS, TagStatus::ASSIGNED)
            ->where(Tag::FACTORY, $factoryId)
            ->get();

        $response = [];
        foreach ($tags as $tag) {
            $response[] = $tag->getId();
        }

        return $response;
    }

    public function assignTag(Request $request)
    {
        try {
            DB::beginTransaction();
            $user = Auth::user();
            $userId = $user->getId();
            $factoryId = $user->getFactoryId();
            $tagId = $request->json('tagId');
            $employeeId = $request->json('employeeId');
            Tag::where(Tag::ID, $tagId)
                ->where(Tag::STATUS, TagStatus::OPEN)
                ->update([
                    Tag::ASSIGN_TO => $employeeId,
                    Tag::MANAGER => $userId,
                    Tag::STATUS => TagStatus::ASSIGNED,
                ]);

            $msgs = $request->json('msgs');
            if (isset($msgs)) {
                $this->_saveMsgs(
                    $msgs, $userId, $tagId, self::ACTION_ASSIGNTAG
                );
                $this->_storeMsgInFile(
                    $msgs, $userId, $tagId
                );
            }

            DB::commit();

            $factoryOpenTags = Cache::get(CacheKeys::OPEN_TAGS . '_' . $factoryId);
            foreach ($factoryOpenTags as $key => $factoryOpenTag) {
                if ($factoryOpenTag['id'] == $tagId) {
                    unset($factoryOpenTags[$key]);
                    Cache::forever(CacheKeys::OPEN_TAGS . '_' . $factoryId, $factoryOpenTags);
                }
            }
            Cache::forget(CacheKeys::ASSIGN_TAGS . '_' . $factoryId);
//            Cache::forget(CacheKeys::OPEN_TAGS . '_' . $factoryId);
            Cache::forget(CacheKeys::TASK_TO_DO . '_assignByMe_' . $userId);
            Cache::forget(CacheKeys::TASK_TO_DO . '_assignByMe_' . $employeeId);
            Cache::forget(CacheKeys::TASK_TO_DO . '_' . $employeeId);
            Cache::forget(CacheKeys::TASK_TO_DO . '_' . $userId);
            Cache::forget(CacheKeys::OPEN_TAG_DETAILS . '_' . $factoryId . '_' . $tagId);

            $oneSignalService = new OneSignalService();
            $oneSignalService->sendNotif(
                'Congrats! One more task is assigned on you. Take a look',
                [$employeeId],
                ['newTaskAssign' => true]
            );

            return $this->getTagsCount();
        } catch (\Exception $ex) {
            \Log::error($ex);
            DB::rollBack();
            throw new \Exception('Generic Error, please try again!');
        }
    }

    public function getAchievements()
    {
        $userId = Auth::user()->getId();
        $factoryId = Auth::user()->getFactoryId();
        $currentDate = new \DateTime('Now', new \DateTimeZone('UTC'));
        $currentDate->setDate(
            date('Y', $currentDate->getTimestamp()),
            date('m', $currentDate->getTimestamp()),
            1);
        $currentDate->setTime(0, 0, 0);
        $date = $currentDate->format('Y-m-d H:i:s');

        $tasksDone = Tag::where(Tag::ASSIGN_TO, $userId)
            ->where(Tag::END_DT, '>', $date)
            ->where(Tag::FACTORY, $factoryId)
            ->groupBy(Tag::ASSIGN_TO)
            ->orderBy('mycount')
            ->selectRaw('t_assign_to, count(t_assign_to) as mycount')
            ->get();

        $tagsReported = Tag::where(Tag::CREATE_BY, $userId)
            ->where(Tag::FACTORY, $factoryId)
            ->where(Tag::INDT_DT, '>', $date)
            ->groupBy(Tag::CREATE_BY)
            ->orderBy('mycount')
            ->selectRaw('t_create_by, count(t_create_by) as mycount')
            ->get();

        $response = [
            'tasksDone' => 0,
            'tasksRank' => 0,
            'tagsReported' => 0,
            'tagsRank' => 0,
        ];

        foreach ($tasksDone as $key => $taskDone) {
            if ($taskDone[Tag::ASSIGN_TO] == $userId) {
                $response['tasksDone'] = $taskDone['mycount'];
                $response['tasksRank'] = $key + 1;
                break;
            }
        }

        foreach ($tagsReported as $key => $tagReported) {
            if ($tagReported[Tag::CREATE_BY] == $userId) {
                $response['tagsReported'] = $tagReported['mycount'];
                $response['tagsRank'] = $key + 1;
                break;
            }
        }

        return $response;
    }

    private function _saveChatMsgs($tagId)
    {
        $msgs = Cache::get('ws_msg_tag_' . $tagId);
        if (is_array($msgs)) {
            foreach ($msgs as $msg) {
                $row = [
                    Massage::ID => $msg->id,
                    Massage::MSG => $msg->message,
                    Massage::TYPE => $msg->type,
                    Massage::USER_ID => $msg->ui,
                    Massage::TAG_ID => $tagId,
                ];
                $rows[] = $row;
            }

            Massage::insert($rows);
        }
    }

    private function _saveMsgs($msgs, $userId, $tagId, $action)
    {
        $rows = [];
        foreach ($msgs as $msg) {

            $type = $this->_getMsgType($msg['type'], $action);

            $row = [
                Massage::ID => $msg['id'],
                Massage::MSG => $msg['message'],
                Massage::TYPE => $type,
                Massage::USER_ID => $userId,
                Massage::TAG_ID => $tagId,
            ];
            $rows[] = $row;
        }

        Massage::insert($rows);
    }

    /**
     * Store messages into file store in order to be picked up in WebSocketService snapshot
     *
     * @param $msgs
     * @param $userId
     * @param $tagId
     */
    private function _storeMsgInFile($msgs, $userId, $tagId)
    {
        $timezone = new \DateTimeZone('Europe/Belgrade');
        $messageTime = new \DateTime('now', $timezone);
        $cacheVals = [];
        foreach ($msgs as $msg) {
            $cacheVal = new \stdClass();
            $cacheVal->type = $msg['type'];
            $cacheVal->id = $msg['id'];
            $cacheVal->message = $msg['message'];
            $cacheVal->date = $messageTime->format('h:i A');
            $cacheVal->ui = $userId;
            $cacheVals[] = $cacheVal;
        }
        Cache::store('file')->put(
            'ws_msg_tag_' . $tagId,
            $cacheVals
        );
    }

    private function _getMsgType($msgTypeFromClient, $action)
    {
        $msgType = null;
        if ($action == self::ACTION_OPENTAG) {
            $msgType = $msgTypeFromClient == MsgType::TEXT
                ? MsgType::TEXT_DESC
                : MsgType::IMG_DESC;
        } else if ($action == self::ACTION_ASSIGNTAG) {
            $msgType = $msgTypeFromClient == MsgType::TEXT
                ? MsgType::TEXT_INSTRUCTION
                : MsgType::IMG_INSTRUCTION;
        }

        return $msgType;
    }

    private function _checkAndSetMode(Tag $tag, $userId, $mode)
    {
        if (self::ACTION_TASK_TO_ME == $mode) {
            $tag->setAssignTo($userId);
            $tag->setStatus(TagStatus::ASSIGNED);
        } else {
            $tag->setStatus(TagStatus::OPEN);
        }
    }

}
