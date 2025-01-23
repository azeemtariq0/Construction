<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariants;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use TCPDF;
use DB;

class AddTransactionController extends Controller
{
	protected $db;
	
    public function index(Request $request)
    {

	    $transaction_no = $request->input('transaction_no','');
			$transaction_date = $request->input('transaction_date','');
			$remarks = $request->input('remarks','');
			$amount = $request->input('amount','');
			$status = $request->input('status','');
			$userId = $request->input('user_id','');
			$orderBy = $request->input('order_by','');
			$userType = $request->input('user_type','');
		
		$search = $request->input('search','');
		$page =  $request->input('page', 1); // Default to page 2 if not specified
		$perPage =  $request->input('limit', 9); // Default to 9 if not specified
		
		$sort_column = $request->input('sort_column','transaction_no');
	        $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';
		
		
		
		$order = Order::Join('user as u', 'u.id', '=', 'transactions.created_by');
		$order = $order->where('transactions.is_deleted',0);
		
		if(!empty($transaction_no)) $order = $order->where('transaction_no','LIKE', '%'.$transaction_no.'%');
		if(!empty($transaction_date)) $order = $order->where('transaction_date','LIKE', '%'.$transaction_date.'%');
		if(!empty($amount)) $order = $order->where('amount','LIKE', '%'.$amount.'%');
		if($userType=="Internal" && !empty($orderBy)) $order = $order->where('transactions.created_by','=', $orderBy);
	
	       if($userType!="Internal") $order = $order->where('transactions.created_by', $userId);		
		    
	
		 if (!empty($search)) {
	            $search = strtolower($search);
	            $order = $order->where(function ($query) use ($search){		       	       
			     $query->where('transactions.transaction_no', 'like', '%' . $search . '%')			
			     ->orWhere('transactions.total_amount', 'like', '%' . $search . '%');			
		      });	      
	         }
		  
		 $order = $order->select('transactions.*','u.name as user_name');
		 $order = $order->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $order);
    }
    
    
     public function show($id, Request $request)
     {	
		     $order = AddTransaction::find();
		    return $this->jsonResponse($order, 200, "Order Detail");
    }

    public function validateRequest($request, $id = null)
    {
		$rules = [
		    'transaction_date' => 'required',
		    'remarks' => 'required',
		    'amount' => 'required'
		 ];

		$validator = Validator::make($request, $rules);
		$response = [];
		if ($validator->fails()) {
			$response = $errors = $validator->errors()->all();
			$firstError = $validator->errors()->first();
			return $firstError;

		}
		return [];
	}
    
    public function store(Request $request)
    {  
    		// Validation Rules
		$isError = $this->validateRequest($request->all());
		if (!empty($isError))
			return $this->jsonResponse($isError, 400, "Request Failed!");
       		
		$userId  = $request->input('user_id','');
		$remarks  = $request->input('remarks','');
		$amount = $request->input('amount','0');
		

	// Start the transaction
	DB::beginTransaction();
	$orderId = $this->get_uuid();
	try {
		$maxCode = AddTransaction::max('document_no');
		
		$AddTransactionData = array(
			"id" =>$orderId,
			"transaction_no" =>'TR-'.str_pad($maxCode + 1, 6, '0', STR_PAD_LEFT),
			"document_no" =>$maxCode + 1,
			"transaction_date" =>date('Y-m-d'),
			"remarks"=>$remarks,
			"amount"=>$amount,
			"created_by"=>$userId 
		);
		AddTransaction::create($AddTransactionData);

		 
	        // Commit the transaction
		DB::commit();
	    } catch (\Exception $e) {
		    // Roll back the transaction if anything failed
		    DB::rollBack();
		    return $this->jsonResponse('Failed to create Transaction: ' . $e->getMessage(),400,"Invalid Order");
	    }
	
	   return $this->jsonResponse(['order_id'=>$orderId],200,"Transaction created Successfully!");
    }
    
    
    public function update($id,Request $request)
    {  
          $userId  = $request->input('user_id','');
				  $transaction_date  = $request->input('transaction_date','');
				  $amount  = $request->input('amount','');
				  $remarks  = $request->input('remarks','');

				   $transaction =AddTransaction::Where('id',$id)->first();
				   $transaction->transaction_date = $transaction_date;
				   $transaction->remarks = $remarks;
				   $transaction->amount = $amount;
				   $transaction->updated_by = $userId;
				   $transaction->update();
	   
	   return $this->jsonResponse(['order_id'=>$id],200,"Transaction created Successfully!");
    }

    public function delete($id,Request $request){  
   
	 		$id = str_replace('-',' ',$id);
    	AddTransaction::where('id',$id)->delete();
	 		return $this->jsonResponse(['
	 			transaction_id'=>$id],200,"Delete Transaction Successfully!");
    }


}