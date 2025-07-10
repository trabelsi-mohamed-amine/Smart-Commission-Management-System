<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'title' => 'Commission des finances',
                'img' => '/img/category-1.jpg'
            ],
            [
                'title' => 'Commission technique',
                'img' => '/img/category-2.jpg'
            ],
            [
                'title' => 'Commission d\'audit',
                'img' => '/img/category-3.jpg'
            ],
            [
                'title' => 'Comité de direction',
                'img' => '/img/category-4.jpg'
            ],
            [
                'title' => 'Commission RH',
                'img' => '/img/category-5.jpg'
            ]
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert([
                'title' => $category['title'],
                'img' => $category['img'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
