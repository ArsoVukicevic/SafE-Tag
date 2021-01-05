<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Service\TagService;
use App\Utils\Utils;
use Illuminate\Http\Request;

class TagController extends Controller
{

    private $_service;

    public function __construct(TagService $tagService)
    {
        $this->_service = $tagService;
    }

    public function OpenTagAction(Request $request)
    {
        Utils::validateRequest($request->all(), $this->_openTagValidator());

        $this->_service->openTag($request);

        return response()->api(true);
    }

    public function GetOpenTagsAction()
    {
        $tags = $this->_service->getOpenTags();

        return response()->api($tags);
    }

    public function GetTagsCountAction()
    {
        $tagsCount = $this->_service->getTagsCount();

        return response()->api($tagsCount);
    }

    public function ResolveTaskAction(Request $request)
    {
        Utils::validateRequest($request->all(), $this->_resolveTagValidator());

        return response()->api(
            $this->_service->resolveTask($request)
        );
    }

    public function GetOpenTagDetailsAction(Request $request)
    {
        Utils::validateRequest($request->all(), $this->_openTagDetailsValidator());

        $tagDetails = $this->_service->getOpenTagDetails(
            $request->json('tagId')
        );

        return response()->api($tagDetails);
    }

    public function GetTaskToDoAction(Request $request)
    {
        $tags = $this->_service->getTaskToDo($request->json('assignByMe'));

        return response()->api($tags);
    }

    public function AssignTagAction(Request $request)
    {
        Utils::validateRequest($request->all(), $this->_assignTagValidator());
        return response()->api(
            $this->_service->assignTag($request)
        );
    }

    public function AchievementsAction()
    {
        $response = $this->_service->getAchievements();

        return response()->api($response);
    }

    private function _openTagValidator()
    {
        return [
            'riskLevel' => ['bail', 'required', 'integer', 'min:1', 'max:100'],
            'classificationId' => ['bail', 'required', 'integer'],
            'itemId' => ['bail', 'required', 'integer'],
            'mode' => ['bail', 'required', 'in:first,second']
        ];
    }

    private function _openTagDetailsValidator()
    {
        return [
            'tagId' => ['required', 'integer']
        ];
    }

    private function _assignTagValidator()
    {
        return [
            'employeeId' => ['bail', 'required', 'integer'],
            'tagId' => ['bail', 'required', 'integer']
        ];
    }

    private function _resolveTagValidator()
    {
        return [
            'tagId' => ['bail', 'required', 'integer']
        ];
    }
}
