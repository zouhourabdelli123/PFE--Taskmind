<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@demo.tn'],
            ['name' => 'Admin Demo', 'password' => Hash::make('password')]
        );

        $manager = User::updateOrCreate(
            ['email' => 'manager@demo.tn'],
            ['name' => 'Manager Demo', 'password' => Hash::make('password')]
        );

        $developer = User::updateOrCreate(
            ['email' => 'dev@demo.tn'],
            ['name' => 'Developer Demo', 'password' => Hash::make('password')]
        );

        $viewer = User::updateOrCreate(
            ['email' => 'viewer@demo.tn'],
            ['name' => 'Viewer Demo', 'password' => Hash::make('password')]
        );

        $team = Team::updateOrCreate(
            ['name' => 'Core Team'],
            ['owner_id' => $admin->id]
        );

        $team->members()->sync([
            $admin->id => ['role' => 'admin'],
            $manager->id => ['role' => 'manager'],
            $developer->id => ['role' => 'developer'],
            $viewer->id => ['role' => 'viewer'],
        ]);

        Project::updateOrCreate(
            ['team_id' => $team->id, 'name' => 'MVP Project'],
            ['description' => 'Initial seeded project', 'created_by' => $manager->id]
        );
    }
}
