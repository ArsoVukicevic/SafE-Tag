<?php


namespace App\Constants;


class DB
{
    const SCHEMA = 'safetag.';

    /**
     * DATABASE TABLES
     */
    const USERS = self::SCHEMA . 'users';
    const AUDIT = self::SCHEMA . 'audits';
    const AUDIT_FACTORY_ITEMS = self::SCHEMA . 'audit_factory_items';
    const CLASSIFICATIONS = self::SCHEMA . 'classifications';
    const CONFIGS = self::SCHEMA . 'configs';
    const FACTORIES = self::SCHEMA . 'factories';
    const FACTORY_ITEMS = self::SCHEMA . 'factory_items';
    const MESSAGES = self::SCHEMA . 'massages';
    const ROLES = self::SCHEMA . 'roles';
    const TAGS = self::SCHEMA . 'tags';
    const USER_SESSIONS = self::SCHEMA . 'user_sessions';
}
