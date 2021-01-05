<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\ExceptionCode;
use App\Http\Controllers\Controller;
use App\Service\UserService;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    private $_userService;

    public function __construct(UserService $userService) {
        $this->_userService = $userService;
    }

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    public function RegisterAction(Request $request) {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            throw new \Exception("Input parameter not valid", ExceptionCode::INVALID_REQ_PARAMS);
        }

        $this->_userService->insertUser($request);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'factoryId'     => ['integer'],
            'workingPlace'  => ['string', 'max:255'],
            'roleId'        => ['required', 'numeric'],
            'name'          => ['required', 'string', 'max:50'],
            'lastname'      => ['required', 'string', 'max:50'],
            //@TODO add regex for mail check
            'email'         => ['required', 'string', 'max:255'],
            'pass'          => ['required', 'string', 'min:5'],
            'phone'         => ['string']
        ]);
    }
}
