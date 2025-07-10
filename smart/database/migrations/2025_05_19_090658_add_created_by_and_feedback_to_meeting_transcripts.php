<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('meeting_transcripts', function (Blueprint $table) {
            // Add created_by column if it doesn't exist
            if (!Schema::hasColumn('meeting_transcripts', 'created_by')) {
                $table->unsignedBigInteger('created_by')->nullable();
                $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            }

            // Add feedback column if it doesn't exist
            if (!Schema::hasColumn('meeting_transcripts', 'feedback')) {
                $table->text('feedback')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('meeting_transcripts', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
            $table->dropColumn('feedback');
        });
    }
};
