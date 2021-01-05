<?php

namespace App\Service;


class ManagerNotify
{

    const MAX_ONE_SIGNAL_EXTERNAL_IDS = 200;

    public static function notify($msg, $data = ['foo' => 'bar'])
    {
        $userService = new EmployeesService();
        $managers = $userService->getMaganers();

        \Illuminate\Support\Facades\Log::info('Manager for notification', [
            $managers
        ]);

        $oneSignalService = new OneSignalService();
        //max manager per request
        $managersChunks = array_chunk($managers, self::MAX_ONE_SIGNAL_EXTERNAL_IDS);
        foreach ($managersChunks as $managersChunk) {
            $oneSignalService->sendNotif($msg, $managersChunk, $data);
        }
    }
}
