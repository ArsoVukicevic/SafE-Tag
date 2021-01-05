<?php

namespace App\Service;

use App\Exceptions\ExceptionCode;
use App\Model\DAO\UserSession;
use App\User;
use App\Utils\Utils;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SessionService
{

    public function createSession($email, $pass)
    {
        $user = User::where('u_email', $email)->first();

        if (is_null($user)) {
            throw new \Exception('Invalid email address', ExceptionCode::INVALID_REQ_PARAMS);
        } else {
            $hashPass = $user->getPass();

            if (!Hash::check($pass, $hashPass)) {
                throw new \Exception('Invalid password!', ExceptionCode::INVALID_REQ_PARAMS);
            }
        }
        /** @var $session UserSession */
        $session = UserSession::where('us_u_id', $user->getId())
            ->where('us_is_mobile', 1)
            ->whereNull('us_enddt')
            ->first();

        if ($session) {
            $session->setEndDt(Utils::getCurrentDate());
            $session->save();
            Cache::forget($session->getToken());
        }

        $newSession = new UserSession();
        $newSession->setUserId($user->getId());
        $newSession->setToken(Str::random(60));
        $newSession->setIsMobile(true);
        $newSession->save();

        Cache::forever($newSession->getToken(), $user);

        $response = new \stdClass();
        $response->user = $user;
        $response->token = $newSession->getToken();

        return $response;
    }

    public function closeSession()
    {
        $userId = Auth::user()->getId();
        UserSession::where(UserSession::USER_ID, $userId)
            ->whereNull(UserSession::END_DT)
            ->update([UserSession::END_DT => Utils::getCurrentDate()]);

        $session = UserSession::where(UserSession::USER_ID, $userId)->first();
        Cache::forget($session->getToken());
    }

}
