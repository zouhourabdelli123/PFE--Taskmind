<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Services\DashboardService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'team_id' => ['required', 'integer', 'exists:teams,id'],
        ]);

        $team = Team::findOrFail($validated['team_id']);

        if (! $team->isMember($request->user())) {
            return $this->errorResponse('FORBIDDEN', 'Access denied.', null, 403);
        }

        return $this->successResponse($this->dashboardService->get($team, $request->user()));
    }
}
