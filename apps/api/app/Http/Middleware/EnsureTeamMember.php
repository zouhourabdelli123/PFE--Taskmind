<?php

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTeamMember
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Team|null $team */
        $team = $request->route('team');

        if (! $team || ! $request->user() || ! $team->isMember($request->user())) {
            return response()->json([
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'Access denied.',
                    'details' => null,
                ],
            ], 403);
        }

        return $next($request);
    }
}
