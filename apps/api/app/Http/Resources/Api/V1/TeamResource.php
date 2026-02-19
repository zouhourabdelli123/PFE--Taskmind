<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'members' => UserResource::collection($this->whenLoaded('members')),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'pending_invitations' => InvitationResource::collection(
                $this->whenLoaded('invitations', fn () => $this->invitations->whereNull('accepted_at')->values())
            ),
            'current_user_role' => $request->user() ? $this->roleFor($request->user()) : null,
            'created_at' => $this->created_at,
        ];
    }
}
