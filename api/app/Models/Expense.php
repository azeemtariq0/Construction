<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'expense';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'expense_code',
        'expense_date',
	    'expense_type_id',
        'is_deleted',
	    'remarks',
        'created_by',
	    'created_by'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var string[]
     */
     
     public function order_detail()
    {
        return $this->hasMany(OrderDetail::class,'order_id')->orderBy('sort_order');
    }
    
}
