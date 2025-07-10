<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ManagerController extends Controller
{    public function getCommissionManagers()
    {
        $managers = User::where('role', 'commission_manager')
                      ->select('id', 'name', 'email', 'role')
                      ->orderBy('name')
                      ->get();

        return response()->json($managers);
    }
}
