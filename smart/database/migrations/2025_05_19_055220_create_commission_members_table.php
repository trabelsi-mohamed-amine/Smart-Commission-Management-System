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
        Schema::create('commission_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('commission_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('commission_id')->references('id')->on('commissions')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Ensure a user can only be added to a commission once
            $table->unique(['commission_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commission_members');
    }
};
