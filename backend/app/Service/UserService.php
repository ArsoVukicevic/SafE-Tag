<?php

namespace App\Service;

use App\Adapter\UserAdapter;
use App\Exceptions\ExceptionCode;
use App\Type\CacheKeys;
use App\Type\Role;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Request;

class UserService
{

    private $_userAdapter;

    public function __construct(UserAdapter $userAdapter)
    {
        $this->_userAdapter = $userAdapter;
    }

    public function insertUser(\stdClass $userRequest)
    {
        $user = Auth::user();
        $factoryId = null;
        if ($user->getRole() == Role::ADMIN) {
            $factoryId = $user->u_f_id;
        } else {
            $factoryId = $userRequest->factoryId;
        }

        if (is_null($factoryId)) {
            throw new \Exception('Factory not exist!', ExceptionCode::INVALID_REQ_PARAMS);
        }

        $userExist = User::where('u_email', $userRequest->email)->first();

        if ($userExist != null) {
            throw new \Exception('Email address already exisst!', ExceptionCode::INVALID_REQ_PARAMS);
        }

        $hashedPass = Hash::make($userRequest->pass);

        $newUser = new User();
        $newUser->u_f_id = $factoryId;
        $newUser->u_working_place = $userRequest->workingPlace;
        $newUser->u_r_id = $userRequest->roleId;
        $newUser->u_name = $userRequest->name;
        $newUser->u_lastname = $userRequest->lastname;
        $newUser->u_email = $userRequest->email;
        $newUser->u_pass = $hashedPass;
        $newUser->u_phone = $userRequest->phone;
        $newUser->u_is_online = false;
        $newUser->u_is_active = true;
        $newUser->save();
        $newUser->u_id = DB::getPdo()->lastInsertId();

        Cache::forget(CacheKeys::FACTORY_EMPLOYEES . '_' . $newUser->u_f_id);
        Cache::forget(CacheKeys::USER_BY_FACTORY . '_' . $newUser->u_f_id);
        if ($newUser->u_r_id == Role::MANAGER) {
            Cache::forget(CacheKeys::FACTORY_MANAGERS . '_' . $newUser->u_f_id);
        }

        return $this->_userAdapter->fromModelToResponse($newUser);
    }

    /**
     * Update user
     *
     * @param Request $request
     * @param User $user
     *
     * @throws \Exception
     */
    public function updateUser(Request $request, $user)
    {
        //@TODO should move in authotization logic
        $allowRoles = array(Role::OWNER, Role::ADMIN);
        if (!in_array($user->getRole(), $allowRoles)) {
            throw new \Exception('User doesn\'t have permison for this action!');
        }

        $userId = $request->json('userId');
        if (!$userId) {
            throw new \Exception('User id miss in request!');
        }

        $columnsForUpdate = [];
        if ($request->json('factoryId')) {
            $columnsForUpdate['u_f_id'] = $request->json('factoryId');
        }
        if ($request->json('workingPlace')) {
            $columnsForUpdate['u_working_place'] = $request->json('workingPlace');
        }
        if ($request->json('roleId')) {
            $columnsForUpdate['u_r_id'] = $request->json('roleId');
        }
        if ($request->json('name')) {
            $columnsForUpdate['u_name'] = $request->json('name');
        }
        if ($request->json('lastname')) {
            $columnsForUpdate['u_lastname'] = $request->json('lastname');
        }
        //@TODO check if email exist
        if ($request->json('email')) {
            $u = User::where('u_email', $request->json('email'))
                ->where('u_id', '<>', $userId)
                ->first();

            if ($u) {
                throw new \Exception('Email address exist!', ExceptionCode::INVALID_REQ_PARAMS);
            }
            $columnsForUpdate['u_email'] = $request->json('email');
        }
        if ($request->json('pass')) {
            $hashedPass = Hash::make($request->json('pass'));
            $columnsForUpdate['u_pass'] = $hashedPass;
        }
        if ($request->json('phone')) {
            $columnsForUpdate['u_phone'] = $request->json('phone');
        }
        if (!is_null($request->json('isActive'))) {
            $columnsForUpdate['u_is_active'] = $request->json('isActive');
        }

        User::where('u_id', $userId)->update($columnsForUpdate);

        Cache::flush();

    }

    public function getUsers(User $user)
    {
        $roleFilter = [];
        $users = [];

        if (Role::OWNER == $user->getRole()) {
            $roleFilter[] = Role::ADMIN;
            $users = User::whereIn('u_r_id', $roleFilter)
                ->orderBy('u_id')
                ->get();
        } else if (Role::ADMIN == $user->getRole()) {
            $roleFilter[] = Role::MANAGER;
            $roleFilter[] = Role::EMPLOYEE;
            $users = User::whereIn('u_r_id', $roleFilter)
                ->where('u_f_id', $user->u_f_id)
                ->orderBy('u_id')
                ->get();
        } else {
            throw new \Exception('Unsuproted role!');
        }

        /* @var $users User */
        $response = [];
        foreach ($users as $u) {
            $response[] = $this->_userAdapter->fromModelToResponse($u);
        }

        return $response;
    }

    public static function getAllUser()
    {
        $factoryId = User::factoryId();
        $cacheKey = CacheKeys::USER_BY_FACTORY . '_' . $factoryId;
        return Cache::rememberForever($cacheKey, function () use ($factoryId) {
            $users = User::where(User::FACTORY_ID, $factoryId)->get();
            $response = [];
            foreach ($users as $user) {
                $response[$user->getId()] = $user;
            }
            return $response;
        });

    }

    public static function getUserForLogin($email, $pass): ?User
    {
        $user = User::where('u_email', $email)->first();

        if (is_null($user)) {
            throw new \Exception('Invalid email address!', ExceptionCode::INVALID_REQ_PARAMS);
        }

        if (!Hash::check($pass, $user->getPass())) {
            throw new \Exception('Invalid password!', ExceptionCode::INVALID_REQ_PARAMS);
        }

        if (!in_array($user->getRole(), [Role::ADMIN, Role::OWNER])) {
            throw new \Exception('User is not authorized!', ExceptionCode::INVALID_REQ_PARAMS);
        }

        if ($user->isActive() !== true) {
            throw new \Exception('User is not active!', ExceptionCode::INVALID_REQ_PARAMS);
        }

        if ($user->getRole() == Role::ADMIN) {
            $factoryService = new FactoryService();
            $factories = $factoryService->getFactories();

            if (!isset($factories[$user->getFactoryId()])) {
                throw new \Exception('User does not have assign factory!');
            }

            if ($factories[$user->getFactoryId()]->licencePaid === false) {
                throw new \Exception('Licence for factory is not paid!');
            }
        }
        return $user;
    }

    public static function getAdditionalData($factoryId)
    {
        $param = 'ws_host_' . $factoryId;
        $wsHostDataJs = DbConfigService::getValue($param);
        $wsHostData = json_decode($wsHostDataJs);

        $response = [];
        $response['ws_host'] = 'ws://' . $wsHostData->host . ':' . $wsHostData->port;
        $response['one_signal_app_id'] = DbConfigService::getValue('one_signal_app_id');

        return $response;
    }
}
