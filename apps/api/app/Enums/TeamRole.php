<?php

namespace App\Enums;

enum TeamRole: string
{
    case Admin = 'admin';
    case Manager = 'manager';
    case Developer = 'developer';
    case Viewer = 'viewer';

    public static function manageable(): array
    {
        return [self::Admin->value, self::Manager->value];
    }
}
