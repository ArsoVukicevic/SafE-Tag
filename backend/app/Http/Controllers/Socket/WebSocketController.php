<?php

namespace App\Http\Controllers\Socket;

use App\Service\WebSocketService;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;

class WebSocketController implements MessageComponentInterface
{
    const COMMAND = 'cmd';
    const SUBSCRIPTION = 'sub';
    const UNSUBSCRIPTION = 'unsub';
    const MESSAGE = 'msg';

    private $webSocketService;

    public function __construct($factoryId)
    {
        $this->webSocketService = new WebSocketService($factoryId);
    }

    /**
     * [onOpen description]
     * @method onOpen
     * @param ConnectionInterface $conn [description]
     * @return [JSON]                    [description]
     * @example connection               var conn = new WebSocket('ws://localhost:8090');
     */
    public function onOpen(ConnectionInterface $conn)
    {
        \Log::info('WebSocketController::onOpen', [
            "Connection {$conn->resourceId} has been establish"
        ]);
    }

    public function onMessage(ConnectionInterface $conn, $msg)
    {
        \Log::info('onMessage: ' . $msg);
        $data = json_decode($msg);
        if (isset($data->cmd)) {
            switch ($data->cmd) {
                case self::SUBSCRIPTION:
                    $this->webSocketService->subscribe($data, $conn);
                    break;
                case self::UNSUBSCRIPTION:
                    $this->webSocketService->unsubscribe($data, $conn);
                    break;
                case self::MESSAGE:
                    $this->webSocketService->sendMsg($data, $conn);
                    break;
                default:
                    break;
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        \Log::info("Connection {$conn->resourceId} has disconnected");
        $this->webSocketService->closeConn($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        \Log::info("An error has occurred: {$e->getMessage()}");
        $conn->close();
    }
}
