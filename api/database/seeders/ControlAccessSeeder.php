<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ControlAccessSeeder extends Seeder
{
    public function run()
    {
        DB::table('_control_access')->insert([
                 ['control_access_id' => 1, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.101],
            ['control_access_id' => 2, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.102],
            ['control_access_id' => 3, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.103],
            ['control_access_id' => 4, 'module_name' => 'Administrator', 'form_name' => 'User Permission', 'route' => 'user_permission', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.104],
            ['control_access_id' => 5, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.201],
            ['control_access_id' => 6, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.202],
            ['control_access_id' => 7, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.203],
            ['control_access_id' => 8, 'module_name' => 'Administrator', 'form_name' => 'User', 'route' => 'user', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 9, 'module_name' => 'Administrator', 'form_name' => 'Settings', 'route' => 'settings', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 10, 'module_name' => 'Administrator', 'form_name' => 'Portal', 'route' => 'portal', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 11, 'module_name' => 'Administrator', 'form_name' => 'Portal', 'route' => 'portal', 'permission_id' => 'view', 'permission_name' => 'View', 'sort_order' => 1.204],
            ['control_access_id' => 12, 'module_name' => 'Administrator', 'form_name' => 'Portal', 'route' => 'portal', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.204],
            ['control_access_id' => 13, 'module_name' => 'Administrator', 'form_name' => 'Portal', 'route' => 'portal', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.204],
            ['control_access_id' => 14, 'module_name' => 'Administrator', 'form_name' => 'Portal', 'route' => 'portal', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 15, 'module_name' => 'Administrator', 'form_name' => 'Portal', 'route' => 'portal', 'permission_id' => 'download', 'permission_name' => 'Download', 'sort_order' => 1.204],
            ['control_access_id' => 16, 'module_name' => 'Administrator', 'form_name' => 'Email Template', 'route' => 'email-template', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 17, 'module_name' => 'Administrator', 'form_name' => 'Email Template', 'route' => 'email-template', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.204],
            ['control_access_id' => 18, 'module_name' => 'Administrator', 'form_name' => 'Email Template', 'route' => 'email-template', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.204],
            ['control_access_id' => 19, 'module_name' => 'Administrator', 'form_name' => 'Email Template', 'route' => 'email-template', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 20, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.201],
            ['control_access_id' => 21, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.202],
            ['control_access_id' => 22, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.203],
            ['control_access_id' => 23, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Master', 'route' => 'parlour-master', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 24, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.201],
            ['control_access_id' => 25, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.202],
            ['control_access_id' => 26, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.203],
            ['control_access_id' => 27, 'module_name' => 'Quote Management', 'form_name' => 'Parlour Request', 'route' => 'parlour-request', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 28, 'module_name' => 'Product Management', 'form_name' => 'Attribute', 'route' => 'attribute', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 29, 'module_name' => 'Product Management', 'form_name' => 'Attribute', 'route' => 'attribute', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.204],
            ['control_access_id' => 30, 'module_name' => 'Product Management', 'form_name' => 'Attribute', 'route' => 'attribute', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.204],
            ['control_access_id' => 31, 'module_name' => 'Product Management', 'form_name' => 'Attribute', 'route' => 'attribute', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 32, 'module_name' => 'Product Management', 'form_name' => 'Product Category', 'route' => 'product-category', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 33, 'module_name' => 'Product Management', 'form_name' => 'Product Category', 'route' => 'product-category', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.204],
            ['control_access_id' => 34, 'module_name' => 'Product Management', 'form_name' => 'Product Category', 'route' => 'product-category', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.204],
            ['control_access_id' => 35, 'module_name' => 'Product Management', 'form_name' => 'Product Category', 'route' => 'product-category', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 36, 'module_name' => 'Product Management', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 37, 'module_name' => 'Product Management', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'add', 'permission_name' => 'Add', 'sort_order' => 1.204],
            ['control_access_id' => 38, 'module_name' => 'Product Management', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.204],
            ['control_access_id' => 39, 'module_name' => 'Product Management', 'form_name' => 'Product', 'route' => 'product', 'permission_id' => 'delete', 'permission_name' => 'Delete', 'sort_order' => 1.204],
            ['control_access_id' => 40, 'module_name' => 'Product Management', 'form_name' => 'Shop', 'route' => 'shop', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 41, 'module_name' => 'Order Management', 'form_name' => 'Order', 'route' => 'order', 'permission_id' => 'list', 'permission_name' => 'List', 'sort_order' => 1.204],
            ['control_access_id' => 42, 'module_name' => 'Order Management', 'form_name' => 'Order', 'route' => 'order', 'permission_id' => 'view', 'permission_name' => 'View', 'sort_order' => 1.204],
            ['control_access_id' => 43, 'module_name' => 'Order Management', 'form_name' => 'Order', 'route' => 'order', 'permission_id' => 'edit', 'permission_name' => 'Edit', 'sort_order' => 1.204],
       

        ]);
    }
}