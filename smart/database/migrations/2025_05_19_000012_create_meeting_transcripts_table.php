<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('meeting_transcripts')) {
            Schema::create('meeting_transcripts', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('meeting_id');
                $table->string('title')->nullable();
                $table->text('content')->nullable();
                $table->text('summary');
                $table->text('decisions');
                $table->text('actions');
                $table->enum('status', ['en attente', 'approuvé', 'rejeté'])->default('en attente');
                $table->string('file_path')->nullable();
                $table->unsignedBigInteger('validated_by')->nullable();
                $table->timestamp('validated_at')->nullable();
                $table->timestamps();

                $table->foreign('meeting_id')->references('id')->on('meetings')->onDelete('cascade');
                $table->foreign('validated_by')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('meeting_transcripts');
    }
};
