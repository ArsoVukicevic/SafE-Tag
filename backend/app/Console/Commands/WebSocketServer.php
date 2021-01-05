<?php

namespace App\Console\Commands;

//use App\Http\Controllers\Socket\WebSocketController;


use App\Http\Controllers\Socket\WebSocketController;
use App\Service\DbConfigService;
use Illuminate\Console\Command;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

class WebSocketServer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'websocket:init {factoryId}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $factoryId = $this->argument('factoryId');
        $wsDbKey = 'ws_host_' . $factoryId;
        $wsHostData = json_decode(DbConfigService::getValue($wsDbKey));
        $port = $wsHostData->port;

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new WebSocketController($factoryId)
                )
            ),
            $port
        );
        $server->run();
    }
}
