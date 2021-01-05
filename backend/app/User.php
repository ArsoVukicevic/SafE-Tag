<?php

namespace App;

use App\Constants\DB;
use App\Type\Database;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
//    protected $hidden = [
//        'password', 'remember_token',
//    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
//    protected $casts = [
//        'email_verified_at' => 'datetime',
//    ];


    const ID = 'u_id';
    const FACTORY_ID = 'u_f_id';
    const ROLE = 'u_r_id';
    const IS_ACTIVE = 'u_is_active';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = self::ID;
    protected $table = DB::USERS;

    public function getAuthPassword()
    {
        return $this->u_pass;
    }

    public function getId()
    {
        return $this->u_id;
    }

    public function getRole()
    {
        return $this->u_r_id;
    }

    public function getFactoryId()
    {
        return $this->u_f_id;
    }

    public function getWorkingPlace()
    {
        return $this->u_working_place;
    }

    public function getName()
    {
        return $this->u_name;
    }

    public function getFullName() {
        return $this->getName() . ' ' . $this->getLastname();
    }

    public function getLastname()
    {
        return $this->u_lastname;
    }

    public function getEmail()
    {
        return $this->u_email;
    }

    public function getPass()
    {
        return $this->u_pass;
    }

    public function getPhone()
    {
        return $this->u_phone;
    }

    public function isOnline()
    {
        return $this->u_is_online;
    }

    public function isActive()
    {
        return $this->u_is_active;
    }

    public static function factoryId()
    {
        return Auth::user()->getFactoryId();
    }
}
