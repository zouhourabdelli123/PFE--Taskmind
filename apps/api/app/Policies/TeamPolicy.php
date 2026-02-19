<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    public function view(User $user, Team $team): bool
    {
        return $team->isMember($user);
    }

    public function update(User $user, Team $team): bool
    {
        return $team->canManage($user);
    }

    public function inviteMember(User $user, Team $team): bool
    {
        return $team->canManage($user);
    }

    public function removeMember(User $user, Team $team): bool
    {
        return $team->canManage($user);
    }

    public function changeRole(User $user, Team $team): bool
    {
        return $team->canManage($user);
    }
}
