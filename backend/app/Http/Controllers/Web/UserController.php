<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Service\FactoryService;
use App\Service\RoleService;
use App\Service\UserService;
use App\Type\Role;
use App\Utils\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use stdClass;
use function response;

/**
 * Description of UserController
 *
 * @author milos
 */
class UserController extends Controller
{

    /** @var UserService */
    private $_userService;
    /** @var FactoryService */
    private $_factoryService;
    /** @var RoleService */
    private $_roleService;

    public function __construct(
        UserService $userService, FactoryService $factoryService, RoleService $roleService
    )
    {
        $this->_userService = $userService;
        $this->_factoryService = $factoryService;
        $this->_roleService = $roleService;
    }

    public function InsertUserAction(Request $request)
    {
        Utils::validateRequest($request->all(), $this->_validator());

        $user = new \stdClass();
        $user->pass = $request->json('insertUserPass');
        $user->email = $request->json('insertUserEmail');
        $user->workingPlace = $request->json('workingPlace');
        $user->roleId = $request->json('roleId');
        $user->name = $request->json('name');
        $user->lastname = $request->json('lastname');
        $user->phone = $request->json('phone');
        $user->factoryId = $request->json('factoryId');
        $userResponse = $this->_userService->insertUser($user);

        return response()->api($userResponse);
    }

    public function UpdateUserAction(Request $request)
    {
        Utils::validateRequest($request->all(), $this->_updateValidator());
        $this->_userService->updateUser($request, Auth::user());

        return response()->api(true);
    }

    public function InsertUserViewAction()
    {
        $response = new stdClass();
        $user = Auth::user();
        if ($user->getRole() == Role::OWNER) {
            $response->factories = array_values($this->_factoryService->getFactories());
        }

        $response->roles = $this->_roleService->getAvailableRoles($user->getRole());

        return response()->api($response);
    }

    public function GetUsersAction()
    {
        $response = $this->_userService->getUsers(Auth::user());

        return response()->api($response);
    }

    private function _validator()
    {
        return [
            'factoryId' => ['nullable', 'bail', 'integer'],
            'workingPlace' => ['bail', 'string', 'max:255'],
            'roleId' => ['bail', 'required', 'numeric'],
            'name' => ['bail', 'required', 'string', 'min:3', 'max:50'],
            'lastname' => ['bail', 'required', 'string', 'min:5', 'max:50'],
            'insertUserEmail' => ['bail', 'email:rfc', 'string', 'max:255'],
            'insertUserPass' => ['bail', 'required', 'string', 'min:5'],
            'phone' => ['bail', 'string']
        ];
    }

    private function _updateValidator()
    {
        return [
            'userId' => ['bail', 'required', 'numeric'],
            'factoryId' => ['bail', 'nullable', 'integer'],
            'workingPlace' => ['bail', 'string', 'max:255'],
            'roleId' => ['bail', 'numeric'],
            'name' => ['bail', 'string', 'min:5', 'max:50'],
            'lastname' => ['bail', 'string', 'min:5', 'max:50'],
            'email' => ['bail', 'email:rfc', 'string', 'max:255'],
            'pass' => ['bail', 'nullable', 'string', 'min:5'],
            'phone' => ['bail', 'string']
        ];
    }
}
