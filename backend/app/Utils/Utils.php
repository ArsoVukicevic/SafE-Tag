<?php

namespace App\Utils;

use App\Exceptions\ExceptionCode;
use Illuminate\Support\Facades\Validator;

class Utils {
    public static function validateRequest($requestParam, array $rules) {
        $validator = Validator::make($requestParam, $rules);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->all()[0], ExceptionCode::INVALID_REQ_PARAMS);
        }
    }

    public static function getRiskPercent($risk) {
        return number_format($risk/100, 2, '.', '');
    }

    public static function getCurrentDate($format = null, $timeZone = null)
    {
        if (!$timeZone) {
            $timeZone = 'UTC';
        }
        $currentDate = new \DateTime('Now', new \DateTimeZone($timeZone));
        if (!$format) {
            $format = 'Y-m-d H:i:s';
        }

        return $currentDate->format($format);
    }
}
