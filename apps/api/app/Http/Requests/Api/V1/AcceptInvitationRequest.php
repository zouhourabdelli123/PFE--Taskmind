<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\V1\Base\ApiFormRequest;

class AcceptInvitationRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string', 'size:64'],
        ];
    }
}
