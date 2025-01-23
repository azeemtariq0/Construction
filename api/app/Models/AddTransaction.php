<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AddTransaction extends Model 
{
    

    protected $primaryKey = 'id'; 
    public $incrementing = false; 

    // protected $connection = 'mysql';
    protected $table = 'transactions';
  

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'id',
        'transaction_code',
        'document_no',
        'transaction_date',
	    'amount',
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
    
}
