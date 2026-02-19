<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\InvitationController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\TeamController;
use App\Http\Controllers\Api\V1\TeamMemberController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });

    Route::post('/invitations/accept', [InvitationController::class, 'accept'])->middleware('auth:sanctum');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/teams', [TeamController::class, 'index']);
        Route::post('/teams', [TeamController::class, 'store']);
        Route::get('/teams/{team}', [TeamController::class, 'show'])->middleware('team.member');

        Route::post('/teams/{team}/members', [TeamMemberController::class, 'store'])->middleware('team.member');
        Route::patch('/teams/{team}/members/{user}', [TeamMemberController::class, 'update'])->middleware('team.member');
        Route::delete('/teams/{team}/members/{user}', [TeamMemberController::class, 'destroy'])->middleware('team.member');

        Route::get('/teams/{team}/projects', [ProjectController::class, 'index'])->middleware('team.member');
        Route::post('/teams/{team}/projects', [ProjectController::class, 'store'])->middleware('team.member');
        Route::get('/teams/{team}/projects/{project}', [ProjectController::class, 'show'])->middleware('team.member');

        Route::get('/dashboard', [DashboardController::class, 'show']);
    });
});
