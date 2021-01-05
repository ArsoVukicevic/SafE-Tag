<?php

namespace App\Providers;

use App\Constants\DB;
use App\Model\DAO\UserSession;
use App\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        $this->defineAuth();
    }

    private function defineAuth()
    {
        Auth::viaRequest('api-token', function ($request) {
            $token = $request->json('token');
            return Cache::rememberForever($token, function () use ($token) {
                return User::join(DB::USER_SESSIONS, User::ID, '=', UserSession::USER_ID)
                    ->where(UserSession::TOKEN, $token)
                    ->whereNull(UserSession::END_DT)
                    ->first();
            });
        });
    }
}
