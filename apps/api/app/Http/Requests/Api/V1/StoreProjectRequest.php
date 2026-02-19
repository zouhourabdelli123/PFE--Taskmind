<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\V1\Base\ApiFormRequest;

class StoreProjectRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}
