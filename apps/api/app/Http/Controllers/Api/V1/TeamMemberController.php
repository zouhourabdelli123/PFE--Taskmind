<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\InviteMemberRequest;
use App\Http\Requests\Api\V1\UpdateMemberRoleRequest;
use App\Http\Resources\Api\V1\InvitationResource;
use App\Http\Resources\Api\V1\TeamResource;
use App\Models\Team;
use App\Models\User;
use App\Services\InvitationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly InvitationService $invitationService)
    {
    }

    public function store(InviteMemberRequest $request, Team $team): JsonResponse
    {
        $this->authorize('inviteMember', $team);

        $result = $this->invitationService->createOrAttach(
            $team,
            $request->validated('email'),
            $request->validated('role'),
            $request->user()
        );

        if ($result['type'] === 'member') {
            $team->load(['owner', 'members', 'projects', 'invitations']);
            return $this->successResponse(new TeamResource($team), ['type' => 'member_attached']);
        }

        return $this->successResponse(new InvitationResource($result['invitation']), ['type' => 'invitation_created'], 201);
    }

    public function update(UpdateMemberRoleRequest $request, Team $team, User $user): JsonResponse
    {
        $this->authorize('changeRole', $team);

        if ($team->owner_id === $user->id) {
            return $this->errorResponse('OWNER_ROLE_LOCKED', 'Cannot change owner role.', null, 422);
        }

        $membership = $team->memberships()->where('user_id', $user->id)->first();

        if (! $membership) {
            return $this->errorResponse('MEMBERSHIP_NOT_FOUND', 'Member not found in team.', null, 404);
        }

        $membership->update(['role' => $request->validated('role')]);

        $team->load(['owner', 'members', 'projects', 'invitations']);

        return $this->successResponse(new TeamResource($team));
    }

    public function destroy(Request $request, Team $team, User $user): JsonResponse
    {
        $this->authorize('removeMember', $team);

        if ($team->owner_id === $user->id) {
            return $this->errorResponse('OWNER_CANNOT_BE_REMOVED', 'Cannot remove team owner.', null, 422);
        }

        $team->members()->detach($user->id);

        return $this->successResponse(null, ['message' => 'Member removed.']);
    }
}
