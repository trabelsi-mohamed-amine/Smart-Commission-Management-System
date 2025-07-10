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
    {        Schema::create('meeting_participants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('meeting_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');            // Note: Join functionality removed, this table now only tracks existing participants
            // and is used for the leave functionality
            $table->unique(['meeting_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_participants');
    }
};
