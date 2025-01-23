<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;


class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'user';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
	'name',
	'username',
	'user_type',
	'email',
	'password',
	'site_url',
	'permission_id',
	'address',
	'phone_no',
	'country_id',
	'api_token',
	'dealer_id',
	'organization',
	'postal_code',
	'status',
	'image',
	'last_login'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    protected $hidden = [
        'password',
    ];
    
    public function permission()
    {
        return $this->hasOne(UserPermission::class,'user_permission_id','permission_id');
    }
    public function country()
    {
        return $this->hasOne(Country::class,'id','country_id');
    }
}
