<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\ExceptionCode;
use App\Http\Controllers\Controller;
use App\Model\Response\LoginResponse;
use App\Service\SessionService;
use App\Service\UserService;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    public function WebLoginAction(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            throw new \Exception("Input parameter not valid", ExceptionCode::INVALID_REQ_PARAMS);
        }

        $user = UserService::getUserForLogin($request->email, $request->pass);
        Auth::login($user);

        $responseUser = new \stdClass();
        $responseUser->username = Auth::user()->u_name;
        $responseUser->role = Auth::user()->u_r_id;

        return response()->api($responseUser);
    }

    public function WebLogoutAction()
    {
        Auth::logout();
        return response()->api(true);
    }

    public function WebCheckLoginAction()
    {
        $user = null;
        if (Auth::check()) {
            $user = new \stdClass();
            $user->username = Auth::user()->u_name;
            $user->role = Auth::user()->u_r_id;
        }

        return response()->api($user);
    }

    public function ApiLoginAction(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            throw new \Exception("Input parameter not valid", ExceptionCode::INVALID_REQ_PARAMS);
        }

        $sessionService = new SessionService();
        $sessionData = $sessionService->createSession(
            $request->json('email'),
            $request->json('pass')
        );


        /**
         * @var $user User
         */
        $user = $sessionData->user;
        $response = new LoginResponse();
        $response->setId($user->getId());
        $response->setRole($user->getRole());
        $response->setToken($sessionData->token);
        $response->setFullName($user->getFullName());
        $response->setAdditionData(
            UserService::getAdditionalData($user->getFactoryId())
        );

        return response()->api($response);
    }

    public function ApiLogoutAction()
    {
        $sessionService = new SessionService();
        $sessionService->closeSession();

        return response()->api(true);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param array $data
     * @return Validator2
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            //@TODO add regex for mail check
            'email' => ['required', 'string', 'max:255'],
            'pass' => ['required', 'string', 'min:4']
        ]);
    }
}
