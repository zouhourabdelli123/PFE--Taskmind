<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreTeamRequest;
use App\Http\Resources\Api\V1\TeamResource;
use App\Models\Team;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $teams = Team::query()
            ->whereHas('members', fn ($query) => $query->where('users.id', $request->user()->id))
            ->with(['owner'])
            ->orderBy('id', 'desc')
            ->get();

        return $this->successResponse(TeamResource::collection($teams));
    }

    public function store(StoreTeamRequest $request): JsonResponse
    {
        $team = Team::create([
            'name' => $request->validated('name'),
            'owner_id' => $request->user()->id,
        ]);

        $team->members()->attach($request->user()->id, ['role' => 'admin']);
        $team->load(['owner', 'members', 'projects', 'invitations']);

        return $this->successResponse(new TeamResource($team), [], 201);
    }

    public function show(Request $request, Team $team): JsonResponse
    {
        $this->authorize('view', $team);

        $team->load(['owner', 'members', 'projects.creator', 'invitations']);

        return $this->successResponse(new TeamResource($team));
    }
}
