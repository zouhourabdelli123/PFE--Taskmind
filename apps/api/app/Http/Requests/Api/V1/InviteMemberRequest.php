<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\TeamRole;
use App\Http\Requests\Api\V1\Base\ApiFormRequest;
use Illuminate\Validation\Rule;

class InviteMemberRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'role' => ['required', Rule::in(array_map(fn (TeamRole $role) => $role->value, TeamRole::cases()))],
        ];
    }
}
