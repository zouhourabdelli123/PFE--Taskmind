<?php

namespace App\Services;

use App\Models\Invitation;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvitationService
{
    public function createOrAttach(Team $team, string $email, string $role, User $createdBy): array
    {
        $email = mb_strtolower(trim($email));

        return DB::transaction(function () use ($team, $email, $role, $createdBy): array {
            $existingUser = User::whereRaw('LOWER(email) = ?', [$email])->first();

            if ($existingUser) {
                $team->members()->syncWithoutDetaching([
                    $existingUser->id => ['role' => $role],
                ]);

                $team->members()->updateExistingPivot($existingUser->id, ['role' => $role]);

                return [
                    'type' => 'member',
                    'member' => $existingUser,
                    'invitation' => null,
                ];
            }

            $invitation = Invitation::updateOrCreate(
                [
                    'team_id' => $team->id,
                    'email' => $email,
                    'accepted_at' => null,
                ],
                [
                    'role' => $role,
                    'token' => Str::random(64),
                    'expires_at' => now()->addDays(7),
                    'created_by' => $createdBy->id,
                ]
            );

            return [
                'type' => 'invitation',
                'member' => null,
                'invitation' => $invitation,
            ];
        });
    }

    public function accept(string $token, User $user): Team
    {
        return DB::transaction(function () use ($token, $user): Team {
            $invitation = Invitation::with('team')
                ->where('token', $token)
                ->whereNull('accepted_at')
                ->first();

            if (! $invitation) {
                abort(404, 'Invitation token is invalid.');
            }

            if ($invitation->expires_at->isPast()) {
                abort(422, 'Invitation has expired.');
            }

            if (mb_strtolower($invitation->email) !== mb_strtolower($user->email)) {
                abort(403, 'This invitation is not for your account.');
            }

            $team = $invitation->team;

            $team->members()->syncWithoutDetaching([
                $user->id => ['role' => $invitation->role],
            ]);
            $team->members()->updateExistingPivot($user->id, ['role' => $invitation->role]);

            $invitation->update([
                'accepted_at' => now(),
            ]);

            return $team->fresh(['owner', 'members', 'projects', 'invitations']);
        });
    }
}
