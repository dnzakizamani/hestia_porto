<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Illustration',
            'Character Design',
            'Concept Art',
            'Digital Painting',
            'Comics',
            'Others',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
