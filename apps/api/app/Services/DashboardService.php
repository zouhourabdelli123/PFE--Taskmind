<?php

namespace App\Services;

use App\Models\Team;
use App\Models\User;

class DashboardService
{
    public function get(Team $team, User $user): array
    {
        $role = $team->roleFor($user);

        $baseStats = [
            'members_count' => $team->memberships()->count(),
            'projects_count' => $team->projects()->count(),
            'pending_invitations_count' => $team->invitations()->whereNull('accepted_at')->count(),
            'owned_projects_count' => $team->projects()->where('created_by', $user->id)->count(),
        ];

        return [
            'team_id' => $team->id,
            'role' => $role,
            'stats' => match ($role) {
                'admin' => $baseStats + [
                    'can_invite' => true,
                    'can_manage_projects' => true,
                    'can_manage_members' => true,
                ],
                'manager' => $baseStats + [
                    'can_invite' => true,
                    'can_manage_projects' => true,
                    'can_manage_members' => true,
                ],
                'developer' => $baseStats + [
                    'can_invite' => false,
                    'can_manage_projects' => false,
                    'can_manage_members' => false,
                ],
                default => $baseStats + [
                    'can_invite' => false,
                    'can_manage_projects' => false,
                    'can_manage_members' => false,
                ],
            },
        ];
    }
}
