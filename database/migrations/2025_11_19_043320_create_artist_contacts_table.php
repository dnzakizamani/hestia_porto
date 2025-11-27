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
        Schema::create('artist_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_id')->constrained()->onDelete('cascade');
            $table->string('platform'); // Nama platform seperti 'Instagram', 'Email', dll
            $table->string('logo')->nullable(); // Path ke logo
            $table->string('value'); // Nilai kontak seperti username atau email
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artist_contacts');
    }
};
