<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cek apakah user sudah ada, jika tidak maka buat
        $user = User::where('email', 'hestia@gmail.com')->first();
        
        if (!$user) {
            User::create([
                'name' => 'hestia',
                'email' => 'hestia@gmail.com',
                'password' => Hash::make('qazwsx'),
            ]);
        }
    }
}