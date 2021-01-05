<?php

namespace App\Service;

use App\Type\MsgType;
use Illuminate\Support\Facades\Cache;

class WebSocketService
{

    private $_oneSignalService;
    /**
     * List of messages for specific topic(tag unique name).
     */
    private $topicMsgs = [];
    /**
     * List user subscriptions (topic). In order to improve performance
     * when when close connection
     */
    private $clientsResourceId = [];

    private $clients;

    public function __construct($factoryId)
    {
        $this->_reCreateMsgs($factoryId);

        $this->_oneSignalService = new OneSignalService();
    }

    public function subscribe($data, $conn)
    {
        $this->clientsResourceId[$conn->resourceId] = $data->u;
        $this->clients[$data->u] = $conn;

        $this->_sendSnapShot($data, $conn);
    }

    public function unsubscribe($data, $conn)
    {
        $this->closeConn($conn);
    }

    public function sendMsg($data, $conn)
    {
        $this->topicMsgs[$data->t][] = $data->m;
        //exp of cache key: ws_msg_tag_{tagId}
        Cache::store('file')->put('ws_msg_' . $data->t, $this->topicMsgs[$data->t]);

        if (isset($this->clients[$data->toUser])) {
            $this->clients[$data->toUser]->send(json_encode($data->m));
        } else {
            //send notif
            $tagParts = explode('_', $data->t);
            $notifBody = $data->m->type == MsgType::IMG
                ? 'Send you a photo'
                : $data->m->message;
            $oneSignalData = [
                'm' => $data->m,
                'tId' => $tagParts[1],
                'toUser' => $data->m->ui
            ];

            $this->_oneSignalService->sendNotif(
                $notifBody,
                [$data->toUser],
                ['newMsg' => $oneSignalData]
            );
        }
    }

    public function closeConn($conn)
    {
        $clientId = $this->clientsResourceId[$conn->resourceId];
        unset($this->clientsResourceId[$conn->resourceId]);
        unset($this->clients[$clientId]);
    }

    private function _reCreateMsgs($factoryId)
    {
        $tagService = new TagService();
        $tags = $tagService->getAssignTags($factoryId);

        foreach ($tags as $tagId) {
            $topic = 'tag_' . $tagId;
            $cacheKey = 'ws_msg_' . $topic;
            $this->topicMsgs[$topic] = Cache::store('file')->get($cacheKey);
        }
    }

    /**
     * First check if snapshot exist in internal memory if not exist check in file store where instruction messages
     * are stored
     * @param $data
     * @param $conn
     */
    private function _sendSnapShot($data, $conn)
    {
        //check if snap shot is required
        if (isset($this->topicMsgs[$data->t])) {
            $snapShot = array_slice($this->topicMsgs[$data->t], $data->msgCount);
            if (!empty($snapShot)) {
                $conn->send(json_encode($snapShot));
            }
        } else if ($snapShotMsg = Cache::store('file')->get('ws_msg_' . $data->t)) {
            $this->topicMsgs[$data->t] = $snapShotMsg;
            $snapShot = array_slice($snapShotMsg, $data->msgCount);
            if (!empty($snapShot)) {
                $conn->send(json_encode($snapShot));
            }
        }
    }
}
