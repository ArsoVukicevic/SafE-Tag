<?php

namespace App\Type;

class AuditStatus
{
    const OPEN = 1;
    const CLOSE = 2;
    const MAP = [
        self::OPEN => 'Open',
        self::CLOSE => 'Closed'
    ];

    public static function getName($id)
    {
        return self::MAP[$id];
    }
}
