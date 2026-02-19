<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AcceptInvitationRequest;
use App\Http\Resources\Api\V1\TeamResource;
use App\Services\InvitationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly InvitationService $invitationService)
    {
    }

    public function accept(AcceptInvitationRequest $request): JsonResponse
    {
        $team = $this->invitationService->accept($request->validated('token'), $request->user());

        return $this->successResponse(new TeamResource($team));
    }
}
