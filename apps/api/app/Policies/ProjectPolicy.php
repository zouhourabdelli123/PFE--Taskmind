<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\Team;
use App\Models\User;

class ProjectPolicy
{
    public function create(User $user, Team $team): bool
    {
        return $team->canManage($user);
    }

    public function view(User $user, Project $project): bool
    {
        return $project->team->isMember($user);
    }

    public function update(User $user, Project $project): bool
    {
        return $project->team->canManage($user);
    }

    public function delete(User $user, Project $project): bool
    {
        return $project->team->canManage($user);
    }
}
