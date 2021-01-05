<?php

namespace App\Type;

class CacheKeys {
    const PREFIX = 'safEtag_';
    const CLASSIFICATION_TREE = self::PREFIX . 'CLASSIFICATION_TREE';
    const ITEMS_TREE = self::PREFIX . 'ITEMS_TREE';
    const FACTORY_EMPLOYEES = self::PREFIX . 'FACTORY_EMPLOYEES';
    const FACTORY_MANAGERS = self::PREFIX . 'FACTORY_MANAGERS';
    const USER_BY_FACTORY = self::PREFIX . 'USER_BY_FACTORY';
    const OPEN_TAGS = self::PREFIX . 'OPEN_TAGS';
    const ASSIGN_TAGS = self::PREFIX . 'ASSIGN_TAGS';
    const OPEN_TAG_DETAILS = self::PREFIX . 'OPEN_TAG_DETAILS';
    const TASK_TO_DO = self::PREFIX . 'TASK_TO_DO';
    const GET_AUDIT = self::PREFIX . 'GET_AUDIT';
    const GET_DASHBOARD_AUDIT = self::PREFIX . 'GET_DASHBOARD_AUDIT';
    const FACTORIES = self::PREFIX . 'FACTORIES';
    const ROLES = self::PREFIX . 'ROLES';
    const CONFIG = self::PREFIX . 'CONFIG';
}
