<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
     public function run(): void
    {
        // Buat 1 Akun Admin Khusus
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@bengkel.com', // Email login admin
            'password' => 'ari123456', // Password admin
            'role' => 'admin', // <--- INI SATU-SATUNYA YANG 'admin'
        ]);
    }
}
