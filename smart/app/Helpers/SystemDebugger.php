<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SystemDebugger
{
    /**
     * Run a comprehensive system check and return results
     *
     * @return array
     */
    public static function runDiagnostics()
    {
        $results = [
            'status' => 'running',
            'timestamp' => now()->toIso8601String(),
            'checks' => []
        ];

        try {
            // Check database connection
            $results['checks']['database'] = self::checkDatabase();

            // Check required directories are writable
            $results['checks']['storage'] = self::checkStoragePermissions();

            // Check PHP version and extensions
            $results['checks']['php'] = self::checkPhpEnvironment();

            // Check Sanctum setup
            $results['checks']['sanctum'] = self::checkSanctumSetup();

            $results['status'] = 'completed';

        } catch (\Exception $e) {
            Log::error("Diagnostics error: {$e->getMessage()}");
            $results['status'] = 'error';
            $results['error'] = $e->getMessage();
        }

        return $results;
    }

    /**
     * Check database connection
     */
    private static function checkDatabase()
    {
        try {
            $tables = DB::select('SHOW TABLES');
            $usersTable = false;

            foreach ($tables as $table) {
                $tableName = reset($table);
                if ($tableName === 'users') {
                    $usersTable = true;
                    break;
                }
            }

            if (!$usersTable) {
                return [
                    'status' => 'warning',
                    'message' => 'Database connected but users table not found'
                ];
            }

            // Check if users table has records
            $userCount = DB::table('users')->count();

            return [
                'status' => 'success',
                'message' => "Database connection successful. Users table found with {$userCount} records.",
                'tables' => count($tables)
            ];
        } catch (\Exception $e) {
            Log::error("Database check error: {$e->getMessage()}");
            return [
                'status' => 'error',
                'message' => 'Database connection failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Check if required directories are writable
     */
    private static function checkStoragePermissions()
    {
        $paths = [
            storage_path(),
            storage_path('app'),
            storage_path('logs'),
            storage_path('framework'),
            storage_path('framework/sessions'),
            storage_path('framework/cache'),
            storage_path('framework/views')
        ];

        $results = [];
        $allSuccessful = true;

        foreach ($paths as $path) {
            $exists = file_exists($path);
            $isWritable = is_writable($path);

            if (!$exists) {
                // Try to create the directory
                try {
                    mkdir($path, 0755, true);
                    $exists = true;
                    $isWritable = is_writable($path);
                } catch (\Exception $e) {
                    // Failed to create
                }
            }

            $results[basename($path)] = [
                'path' => $path,
                'exists' => $exists,
                'writable' => $isWritable
            ];

            if (!$exists || !$isWritable) {
                $allSuccessful = false;
            }
        }

        // Try to write to a test log file
        try {
            $testLogFile = storage_path('logs/test_'.time().'.log');
            file_put_contents($testLogFile, 'Test log entry: ' . date('Y-m-d H:i:s'));
            $results['test_write'] = [
                'status' => 'success',
                'message' => 'Successfully wrote to test log file'
            ];
        } catch (\Exception $e) {
            $results['test_write'] = [
                'status' => 'error',
                'message' => 'Failed to write to test log file: ' . $e->getMessage()
            ];
            $allSuccessful = false;
        }

        return [
            'status' => $allSuccessful ? 'success' : 'error',
            'details' => $results
        ];
    }

    /**
     * Check PHP environment
     */
    private static function checkPhpEnvironment()
    {
        $requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'tokenizer', 'ctype', 'mbstring', 'openssl'];
        $missingExtensions = [];

        foreach ($requiredExtensions as $ext) {
            if (!extension_loaded($ext)) {
                $missingExtensions[] = $ext;
            }
        }

        return [
            'version' => PHP_VERSION,
            'missing_extensions' => $missingExtensions,
            'status' => empty($missingExtensions) ? 'success' : 'warning'
        ];
    }

    /**
     * Check Laravel Sanctum setup
     */
    private static function checkSanctumSetup()
    {
        try {
            // Check if personal_access_tokens table exists
            $tableExists = DB::getSchemaBuilder()->hasTable('personal_access_tokens');

            if (!$tableExists) {
                return [
                    'status' => 'error',
                    'message' => 'personal_access_tokens table does not exist. Sanctum migrations may not have been run.'
                ];
            }

            return [
                'status' => 'success',
                'message' => 'Sanctum appears to be properly installed'
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Error checking Sanctum setup: ' . $e->getMessage()
            ];
        }
    }
}
