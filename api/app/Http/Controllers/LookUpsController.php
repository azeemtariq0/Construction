<?php

namespace App\Http\Controllers;
use Illuminate\Database\DatabaseManager;
use App\Models\Country;
use App\Models\ControlAccess;
use App\Models\ParlourModule;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LookUpsController extends Controller
{
	 protected $db;
    
    public function getCountry(Request $request)
    {
	$perPage = 10;
        $page = $request->input('page',1);
        $sort_column = $request->input('sort_column','id');
        $sort_direction = (isset($request->input['sort_direction']) && $request->input['sort_direction'] == 'ascend')? 'desc' : 'asc';
        $search = $request->input('search');
	
	$country = new Country;
        if (!empty($search)) {
            $search = strtolower($search);
            $country = $country->where('name', 'like', '%' . $search . '%')
	    	       ->orWhere('dial_code', 'like', '%' . $search . '%');
        }
	 $country = $country->orderBy($sort_column, $sort_direction)->paginate($perPage, ['*'], 'page', $page);
         return response()->json( $country);
    }

    public function getModules() {

        $controls = ControlAccess::orderBy('sort_order','asc')->get();

        $arrPermissions = [];
        foreach($controls as $permission) {
            $module_name       = $permission->module_name;
            $form_name         = $permission->form_name;
            $control_access_id = $permission->control_access_id;
            $route             = $permission->route;
            $permission_id     = $permission->permission_id;
            $permission_name   = $permission->permission_name;
            
            $arrPermissions[$module_name][$form_name][] = [
                'control_access_id' => $control_access_id,
                'route'             => $route,
                'permission_id'     => $permission_id,
                'permission_name'   => $permission_name,
                'selected'          => 0,
            ];
        }

        return response()->json( $arrPermissions);
    }

    public function getModuleForEmail() {

        $template = new EmailTemplate;
        $modules = $template->getModules();
	$moduleTags = $template->getModules();
	
	$result = [];
	foreach ($modules as $key => $value) {
	    $result[] = ["value" => $key, "label" => $value];
	}

        return response()->json( $result);
    }
    
    public function getModuleTagsForEmail(Request $request) {
	
	$tag = str_replace('-',' ',$request->tag);
        $template = new EmailTemplate;
	$moduleTags = $template->getModuleTags();
	
	$result = [];
	foreach ($moduleTags[$tag] as $key => $value) {
	    $result[] = $value;
	}

        return response()->json( $result);
    }

    
    public function getParlourModules() {

        $parlourModules = ParlourModule::get();
        $arrPermissions = [];
        foreach($parlourModules as $parlourModule) {
            $arrModules[] = [
                'value' => $parlourModule->id,
                'label'=> $parlourModule->name,
            ];
        }

        return response()->json( $arrModules);
    }

}
