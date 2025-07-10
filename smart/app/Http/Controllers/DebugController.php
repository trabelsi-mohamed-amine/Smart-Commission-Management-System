<?php

namespace App\Http\Controllers;

use App\Helpers\SystemDebugger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DebugController extends Controller
{
    public function testLog(Request $request)
    {
        // Log something to Laravel's log file
        Log::info('Debug logging test', $request->all());

        // Test database connection
        try {
            $tables = \DB::select('SHOW TABLES');
            return response()->json([
                'status' => 'success',
                'message' => 'Logging working properly',
                'tables' => $tables
            ]);
        } catch (\Exception $e) {
            Log::error('Database connection error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function systemDiagnostics()
    {
        $results = SystemDebugger::runDiagnostics();
        return response()->json($results);
    }
}
