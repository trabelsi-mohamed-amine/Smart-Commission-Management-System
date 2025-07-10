<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToMeetingsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('participant_count');
        });

        // Set all past meetings as completed, upcoming meetings as pending
        DB::statement("UPDATE meetings SET status = 'completed' WHERE date < NOW()");
        DB::statement("UPDATE meetings SET status = 'pending' WHERE date >= NOW()");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
