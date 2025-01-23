<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'settings';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
         'module',
         'field',
         'value'
    ];



       protected $modules = [
		'Create User'=>'Create User',
		'Update Password'=>'Update Password',
		'Forgot Password'=>'Forgot Password',
		"Reset Password"=>"Reset Password",
		'Create Quote Request'=>'Create Quote Request',
		'Update Quote Request'=>'Update Quote Request',
		'Order Creation'=>'Order Creation',
		'Order Cancellation'=>'Order Cancellation',
		'Order Shipped'=>'Order Shipped',
		'Chat Message'=>'Chat Message'
	];
	
	
	protected $moduleTags = [
		'Create User'=>['<Email>','<Password>','<Link>'],
		'Update Password'=>['<Link>'],
		'Forgot Password'=>['<Link>','<Reset Password>'],
		"Reset Password"=>["<Link>"],
		'Create Quote Request'=>['<Request ID>','<Link>'],
		'Update Quote Request'=>['<Request ID>','<Link>'],
		'Order Creation'=>['<Order ID>','<Table Order>'],
		'Order Cancellation'=>['<Order ID>','<Table Order>','<Link>'],
		'Order Shipped'=>['<Order ID>','<Remarks>','<Link>','<Order Date>','<Order ID>'],
		'Chat Message'=>['<Link>']
	];


	public function getModules()
	{
		return $this->modules;
	}
	public function getModuleTags()
	{
		return $this->moduleTags;
	}


    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
    
}
