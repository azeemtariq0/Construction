<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Attributes;
use App\Models\ProductAttributes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ExpenseTypeController extends Controller
{
	 protected $db;
    
    public function index(Request $request)
    {
        
	 if(!isPermission('list','expense_type',$request->permission_list) && isset($request->check_permission)) 
	  	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
	 $name = $request->input('name',''); 
	 $search = $request->input('search','');
	 $page =  $request->input('page', 1); // Default to page 2 if not specified
	 $perPage =  $request->input('limit', 10); // Default to 10 if not specified
	 $sort_column = $request->input('sort_column','expense_type.created_at');
     $sort_direction = ($request->input('sort_direction')=='ascend') ? 'asc' : 'desc';

     $expense_types = Attributes::where('expense_type.is_deleted',0);
	 if(!empty($name)) $expense_types = $attributes->where('expense_type.name', 'like', '%'.$name.'%');
	 
	 if (!empty($search)) {
            $search = strtolower($search);
              $expense_types = $expense_types->where('expense_type.name', 'like', '%' . $search . '%');
		  
         }
	 
	 $expense_types =  $expense_types->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
	 
         return response()->json( $expense_types);
    }
    
    public function show($id,Request $request)
    {
	   if(!isPermission('edit','expense_type',$request->permission_list)) 
	    	return $this->jsonResponse('Permission Denied!',403,"No Permission");
		
         $expense_type = Attributes::where('id',$id)->first();
         return $this->jsonResponse($expense_type,200,"Attribute Data");
    }
    
     public function validateRequest($request,$id=null) 
     {
      $rules = [
	  'name' => [
	            'required',
		     Rule::unique('expense_type')->where('is_deleted',0)->ignore($id)
		     ]
      ];
   
     $validator = Validator::make($request, $rules);  
     $response = []; 
	    if ($validator->fails()) {
	        $response =  $errors = $validator->errors()->all();
		 $firstError = $validator->errors()->first();
	         return  $firstError;
		
	    }
   	return [];
    }
    
    public function store(Request $request)
    {  
       // Validation Rules
      $isError = $this->validateRequest($request->all());
      if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
      
        Attributes::create([
            'name' => trim($request->name),
        ]);
         return $this->jsonResponse("Add Expense Type",200,"Add Expense Type Successfully!");
    }
    
    public function update( Request $request,$id)
    {   
       // Validation Rules
       $isError = $this->validateRequest($request->all(),$id);
       if(!empty($isError)) return $this->jsonResponse( $isError,400,"Request Failed!");
       
        $attribute  = Attributes::where('id',$id)->first();
        $attribute->name  = trim($request->name);
	$attribute->save();

         return $this->jsonResponse(['expense_type_id'=>$id],200,"Update Expense Type Successfully!");
    }
    public function delete($id,Request $request)
    {  
    
       if(!isPermission('delete','expense_type',$request->permission_list)) 
	 		return $this->jsonResponse('Permission Denied!',403,"No Permission");
	

    	$expense_type  = ExpenseTypes::where('id',$id)->first();
	    if(!$expense_type) return $this->jsonResponse(['id'=>$id],404,"Expense Type Not Found!");
	 
	 // $productexpense_type = Productexpense_types::where('expense_type_id',$id)->first();
	 // if(!empty($productexpense_type)) return $this->jsonResponse("Document Exist Aganist this Expense Type!",404,"Document Exist Aganist this expense_type!");
		
	 $expense_type->is_deleted=1;
	 $expense_type->save();
	 return $this->jsonResponse(['attribute_id'=>$id],200,"Delete Attribute Successfully!");
    }
    
    
    public function bulkDelete(Request $request) {
    
    
       if(!isPermission('delete','expense_type',$request->permission_list)) 
	 		return $this->jsonResponse('Permission Denied!',403,"No Permission");
		    
        
        try {
            if (isset($request->expense_types) && !empty($request->expense_types) && is_array($request->expense_types)) {
                foreach ($request->expense_types as $expense_type) {
                    $attribute = ExpenseType::where('id',$expense_type)->first();
		    
		    // $productAttribute = ProductAttributes::where('attribute_id',$attribute_id)->first();
		    // if(empty($productAttribute )){
		    // 	$attribute->is_deleted = 1;
		    // 	$attribute->update();
		    // }
                }
            }
	    
	    return $this->jsonResponse('Deleted',200,"Delete Expense Types successfully!");
        } catch (\Exception $e) {
	    return $this->jsonResponse('some error occured',500,$e->getMessage());
        }  
    }
    

}
