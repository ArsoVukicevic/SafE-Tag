<?php
namespace App\Service;

use App\Model\DAO\Config;
use App\Type\CacheKeys;
use Illuminate\Support\Facades\Cache;

class DbConfigService {

    public static function getValue(string $param) {
        $configs = self::_loadValue();

        return $configs[$param] ?? null;
    }

    private static function _loadValue() {
        return Cache::rememberForever(CacheKeys::CONFIG , function () {
            $configs = Config::all();

            $response = [];
            foreach ($configs as $config) {
                $response[$config->getParam()] = $config->getValue();
            }

            return $response;
        });
    }
}
