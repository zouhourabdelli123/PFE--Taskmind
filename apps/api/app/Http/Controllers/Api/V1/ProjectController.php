<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreProjectRequest;
use App\Http\Resources\Api\V1\ProjectResource;
use App\Models\Project;
use App\Models\Team;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use ApiResponse;

    public function index(Request $request, Team $team): JsonResponse
    {
        $this->authorize('view', $team);

        $projects = $team->projects()->with('creator')->latest()->get();

        return $this->successResponse(ProjectResource::collection($projects));
    }

    public function store(StoreProjectRequest $request, Team $team): JsonResponse
    {
        $this->authorize('create', [Project::class, $team]);

        $project = $team->projects()->create([
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
            'created_by' => $request->user()->id,
        ]);

        $project->load('creator');

        return $this->successResponse(new ProjectResource($project), [], 201);
    }

    public function show(Request $request, Team $team, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        if ($project->team_id !== $team->id) {
            return $this->errorResponse('PROJECT_TEAM_MISMATCH', 'Project does not belong to team.', null, 404);
        }

        $project->load('creator');

        return $this->successResponse(new ProjectResource($project));
    }
}
