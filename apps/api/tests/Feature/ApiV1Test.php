<?php

namespace Tests\Feature;

use App\Models\Invitation;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ApiV1Test extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_register_and_login(): void
    {
        $register = $this->postJson('/api/v1/auth/register', [
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $register->assertCreated()->assertJsonStructure(['data' => ['id', 'email'], 'meta']);

        auth()->logout();

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'alice@example.com',
            'password' => 'password',
        ]);

        $login->assertOk()->assertJsonStructure(['data' => ['id', 'email'], 'meta']);
    }

    #[Test]
    public function user_can_create_team_and_be_admin_member(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/teams', [
            'name' => 'Platform',
        ]);

        $response->assertCreated();

        $teamId = $response->json('data.id');

        $this->assertDatabaseHas('team_members', [
            'team_id' => $teamId,
            'user_id' => $user->id,
            'role' => 'admin',
        ]);
    }

    #[Test]
    public function admin_can_invite_member_and_create_invitation(): void
    {
        [$team, $admin] = $this->seedTeamWithRole('admin');

        $response = $this->actingAs($admin)->postJson("/api/v1/teams/{$team->id}/members", [
            'email' => 'new.member@example.com',
            'role' => 'developer',
        ]);

        $response->assertCreated()->assertJsonPath('meta.type', 'invitation_created');

        $this->assertDatabaseHas('invitations', [
            'team_id' => $team->id,
            'email' => 'new.member@example.com',
            'role' => 'developer',
        ]);
    }

    #[Test]
    public function invited_user_can_accept_invitation(): void
    {
        [$team, $admin] = $this->seedTeamWithRole('admin');

        $invited = User::factory()->create([
            'email' => 'invited@example.com',
            'password' => Hash::make('password'),
        ]);

        $invitation = Invitation::factory()->create([
            'team_id' => $team->id,
            'email' => 'invited@example.com',
            'role' => 'viewer',
            'created_by' => $admin->id,
            'expires_at' => now()->addDays(7),
            'accepted_at' => null,
        ]);

        $response = $this->actingAs($invited)->postJson('/api/v1/invitations/accept', [
            'token' => $invitation->token,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('team_members', [
            'team_id' => $team->id,
            'user_id' => $invited->id,
            'role' => 'viewer',
        ]);

        $this->assertDatabaseMissing('invitations', [
            'id' => $invitation->id,
            'accepted_at' => null,
        ]);
    }

    #[Test]
    public function manager_can_create_project(): void
    {
        [$team, $manager] = $this->seedTeamWithRole('manager');

        $response = $this->actingAs($manager)->postJson("/api/v1/teams/{$team->id}/projects", [
            'name' => 'Project A',
            'description' => 'Desc',
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('projects', [
            'team_id' => $team->id,
            'name' => 'Project A',
            'created_by' => $manager->id,
        ]);
    }

    #[Test]
    public function developer_cannot_create_project_403(): void
    {
        [$team, $developer] = $this->seedTeamWithRole('developer');

        $response = $this->actingAs($developer)->postJson("/api/v1/teams/{$team->id}/projects", [
            'name' => 'Not allowed',
            'description' => 'Nope',
        ]);

        $response->assertForbidden();
    }

    #[Test]
    public function viewer_gets_dashboard_readonly(): void
    {
        [$team, $viewer] = $this->seedTeamWithRole('viewer');

        $response = $this->actingAs($viewer)->getJson("/api/v1/dashboard?team_id={$team->id}");

        $response
            ->assertOk()
            ->assertJsonPath('data.role', 'viewer')
            ->assertJsonPath('data.stats.can_manage_projects', false)
            ->assertJsonPath('data.stats.can_manage_members', false);
    }

    private function seedTeamWithRole(string $role): array
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $team = Team::factory()->create([
            'owner_id' => $owner->id,
        ]);

        $team->members()->attach($owner->id, ['role' => 'admin']);
        $team->members()->attach($member->id, ['role' => $role]);

        return [$team, $member];
    }
}
