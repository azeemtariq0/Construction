<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{

    public static $secret = 'Burhani';
    protected $table = 'user';
    protected $primaryKey = 'api_token';
    public $timestamps = false;

    protected $hidden = [];

    public static function login($credentials) {
        $email = $credentials['email'];
        $password = md5($credentials['password']);

        $user = User::where('email',$email)
		->where('password',$password)
		->where('is_deleted',0)
		->where('status',1)->first();
	$muser = [];
        if($user) {
            $header = [
                'alg' => 'HS256',
                'typ' => 'JWT'
            ];

            $payload = [
		'permission_id' => json_encode($user->permission_id),
                'r' => rand(111111, 999999),
                'exp' => time() * 60 * 24 // 1 day
            ];
            $token = self::generate_token($header, $payload);
            $userData = User::with('country')->where('email',$email)->where('is_deleted',0)->first();

            $aUserGroup = UserPermission::where('user_permission_id', $userData->permission_id)->select('user_permission_id','permission')->first();
            $permission = (empty($aUserGroup)) ? null : json_decode($aUserGroup->permission);

            if($userData) {
                $mUser['user_id']= $userData->id;
		$mUser['user_type'] = $userData->user_type;
                $mUser['api_token']= $token;
                $mUser['name'] = $userData->name;
                $mUser['email'] = $userData->email;
		$mUser['organization'] = $userData->organization;
		$mUser['country_id'] = @$userData->country_id;
		$mUser['country_name'] = @$userData->country->name;
		$mUser['phone_no'] = $userData->phone_no;
		$mUser['postal_code'] = $userData->postal_code;
		$mUser['address'] = $userData->address;
                $mUser['permission_id'] = $userData->permission_id;
                $mUser['permission'] = $permission;
		$mUser['is_change_password'] = $userData->is_change_password;
		$mUser['image'] = $userData->image;
		$mUser['image_url']  = !empty($userData->image) ?  url('public/uploads/'.$userData->image) : '';

                //Update Token
                $userData->api_token = $mUser['api_token'];
                $userData->last_login = date('Y-m-d H:i:s');
                $userData->save();

            }
        }
        return $mUser ?? [];

    }

    public static function userPermission($filter) {

        $user_id = $filter['user_id'];
        $company_id = $filter['company_id'];
        $company_branch_id = $filter['company_branch_id'];
        $fiscal_year_id = $filter['fiscal_year_id'];

        $userBranch = UserBranchAccess::with('company','company_branch')
            ->where('user_id',$user_id)
            ->where('company_id',$company_id)
            ->where('company_branch_id',$company_branch_id)
            ->first();

        if(empty($userBranch))  return " No Permission! ";

        $aUser = User::where('user_id',$user_id)->where('status','Active')->first();
        if(empty($aUser))  return " Invalid User or User Inactive !";

        $aFiscalYear = FiscalYear::where('fiscal_year_id',$fiscal_year_id)->where('company_id',$company_id)->first();
        if(empty($aFiscalYear)) return " Financial Year not defined ";
        $db_name = $aFiscalYear['db_name'];

        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];

        $payload = [
            'user_id' => $user_id,
            'login_name' => $aUser['login_name'],
            'company_id' => $company_id,
            'company_branch_id' => $company_branch_id,
            'fiscal_year_id' => $fiscal_year_id,
            'db_name' => $db_name,
            'r' => rand(111111, 999999),
            'exp' => time() * 60 * 24 // 1 day
        ];

        $token = self::generate_token($header, $payload);
        $aUser['api_token'] = $token;
        $aUser['company_id'] = $company_id;
        $aUser['company_name'] = $userBranch->company->name;
        $aUser['company_branch_id'] = $company_branch_id;
        $aUser['company_branch_name'] = $userBranch->company_branch->name;
        $aUser['fiscal_year_id'] = $fiscal_year_id;
        $aUser['fiscal_year_name'] = $aFiscalYear['name'];
        $aUser['db_name'] = $aFiscalYear['db_name'];

        $aUserGroup = UserPermission::where('user_permission_id', $aUser['user_permission_id'])->select('user_permission_id','permission')->first();
        $aUser['permission'] = (empty($aUserGroup)) ? null : json_decode($aUserGroup['permission']);

        unset($aUser['login_password']);
        $userTokenUpdate = User::where('user_id', $user_id)->firstOrFail();
        $userTokenUpdate->api_token = $aUser['api_token'];
        $userTokenUpdate->last_login = date('Y-m-d H:i:s');
        $userTokenUpdate->save();


        return $aUser;

    }


    public static function generate_token($headers, $payload) {
        $headers_encoded = self::base64url_encode(json_encode($headers));
        $payload_encoded = self::base64url_encode(json_encode($payload));
        $signature = hash_hmac('SHA256', "$headers_encoded.$payload_encoded", self::$secret, true);
        $signature_encoded = self::base64url_encode($signature);
        $token = "$headers_encoded.$payload_encoded.$signature_encoded";

        return $token;
    }

    public static function is_token_valid($token) {
        // split the jwt
        $tokenParts = explode('.', $token);

        if(count($tokenParts)<2){
            return FALSE;
        }
        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1] ?? "");
        $signature_provided = $tokenParts[2] ?? "";


        // check the expiration time - note this will cause an error if there is no 'exp' claim in the jwt
        $expiration = json_decode($payload)->exp ?? "";
	$permissionId = json_decode($payload)->permission_id;
	$permissionId = json_decode($permissionId);
	
        // $db_name = json_decode($payload)->db_name;
        $is_token_expired = ($expiration - time()) < 0;

        // build a signature based on the header and payload using the secret
        $base64_url_header = self::base64url_encode($header);
        $base64_url_payload = self::base64url_encode($payload);
        $signature = hash_hmac('SHA256', $base64_url_header . "." . $base64_url_payload, self::$secret, true);
        $base64_url_signature = self::base64url_encode($signature);

        // verify it matches the signature provided in the jwt
        $is_signature_valid = ($base64_url_signature === $signature_provided);

        if ($is_token_expired || !$is_signature_valid) {
            return FALSE;
        } else {
            return $permissionId;
        }
    }

    public static function base64url_encode($str) {
        return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
    }

}