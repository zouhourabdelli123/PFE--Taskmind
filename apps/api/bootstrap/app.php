<?php

use App\Http\Middleware\EnsureTeamMember;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();

        $middleware->alias([
            'team.member' => EnsureTeamMember::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (ValidationException $exception) {
            return response()->json([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Validation failed.',
                    'details' => $exception->errors(),
                ],
            ], 422);
        });

        $exceptions->render(function (UnauthorizedHttpException $exception) {
            return response()->json([
                'error' => [
                    'code' => 'UNAUTHENTICATED',
                    'message' => 'Unauthenticated.',
                    'details' => null,
                ],
            ], 401);
        });

        $exceptions->render(function (AccessDeniedHttpException $exception) {
            return response()->json([
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'Access denied.',
                    'details' => null,
                ],
            ], 403);
        });

        $exceptions->render(function (NotFoundHttpException $exception) {
            return response()->json([
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Resource not found.',
                    'details' => null,
                ],
            ], 404);
        });

        $exceptions->render(function (ThrottleRequestsException $exception) {
            return response()->json([
                'error' => [
                    'code' => 'TOO_MANY_REQUESTS',
                    'message' => 'Too many requests.',
                    'details' => null,
                ],
            ], 429);
        });

        $exceptions->render(function (HttpExceptionInterface $exception) {
            $status = $exception->getStatusCode();

            return response()->json([
                'error' => [
                    'code' => 'HTTP_ERROR',
                    'message' => $exception->getMessage() ?: 'HTTP error.',
                    'details' => null,
                ],
            ], $status);
        });

        $exceptions->render(function (Throwable $exception) {
            if (config('app.debug')) {
                return null;
            }

            return response()->json([
                'error' => [
                    'code' => 'SERVER_ERROR',
                    'message' => 'Internal server error.',
                    'details' => null,
                ],
            ], 500);
        });
    })->create();

