<?php

namespace App\Service;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Log;

class OneSignalService
{

    private $_httpClient;

    public function __construct()
    {
        $this->_httpClient = new Client();
    }

    public function sendNotif(string $msg, array $userIds, $data = ['foo' => 'bar'])
    {
        $externalUserIds = $this->_createExternalIds($userIds);
        # Send an asynchronous request.
        $request = new Request(
            'POST',
            'https://onesignal.com/api/v1/notifications',//@TODO put into env
            $this->_getHeader(),
            $this->_getBody($msg, $data, $externalUserIds)
        );

        $this->_httpClient->sendAsync($request)->then(
            function ($response) {
                Log::info('Http Client sendAsync', ['I completed! ' . $response->getBody()]);
            },
            function ($onRejected) {
                Log::error('Http Client onRejected', [$onRejected]);
            }
        )->wait();
    }


    private function _getBody(string $msg, $data, array $externalUserIds)
    {
        $fields = array(
            'app_id' => "f6e52fea-389c-4e4d-9c0b-3d309403d915",
            'include_external_user_ids' => $externalUserIds,
            'data' => $data,
            'contents' => array("en" => $msg)
        );

        return json_encode($fields);
    }

    private function _getHeader()
    {
        return array(
            'Content-Type' => 'application/json; charset=utf-8',
            'Authorization' => 'Basic ZGI3MjEzOGMtM2E1YS00OWI5LTgzNjUtNjc3MTI2MTEzZjk1'
        );
    }

    private function _createExternalIds($managers)
    {
        $externalIds = [];
        foreach ($managers as $managerId) {
            $externalIds[] = 'safEtag_' . $managerId;
        }

        return $externalIds;
    }
}
