<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Service;

use App\Adapter\FactoryAdapter;
use App\Model\DAO\Factory;
use App\Type\CacheKeys;
use App\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Request;

/**
 * Description of RoleService
 *
 * @author milos
 */
class FactoryService {

    public function getFactory() {
        $factoryId = User::factoryId();
        $factories = $this->_loadFactories();
        foreach ($factories as $fId => $factory) {
            if ($factoryId == $fId) {
                return $factory;
            }
        }
    }

    public function getFactories() {
        return $this->_loadFactories();
    }

    public function insertFactory(Request $request) {
        $factory = new Factory();
        $factory->f_name         = $request->json('name');
        $factory->f_address      = $request->json('address');
        $factory->f_phone        = $request->json('phone');
        $factory->f_info         = $request->json('info');
        $factory->f_licence_paid = $request->json('licence');
        $factory->save();
        $factory->f_id = DB::getPdo()->lastInsertId();

        Cache::forget(CacheKeys::FACTORIES);

        $adapter = new FactoryAdapter();

        return $adapter->fromModelToResponse($factory);
    }

    public function updateFactory(Request $request) {
        //@TODO should move in authotization logic

        $columnsForUpdate = [];
        if ($request->json('name')) {
            $columnsForUpdate['f_name'] = $request->json('name');
        }
        if ($request->json('address')) {
            $columnsForUpdate['f_address'] = $request->json('address');
        }
        if ($request->json('phone')) {
            $columnsForUpdate['f_phone'] = $request->json('phone');
        }
        if ($request->json('info')) {
            $columnsForUpdate['f_info'] = $request->json('info');
        }
        if (!is_null($request->json('licencePaid'))) {
            $columnsForUpdate['f_licence_paid'] = $request->json('licencePaid');
        }

        $factoryId = $request->json('id');
        Factory::where('f_id', $factoryId)->update($columnsForUpdate);
    }

    private function _loadFactories() {
        return Cache::rememberForever(CacheKeys::FACTORIES, function () {
                $factories = Factory::orderBy('f_id')->get();

                $response = [];
                foreach ($factories as $factory) {
                    $f = new \stdClass();
                    $f->id = $factory->f_id;
                    $f->name = $factory->f_name;
                    $f->address = $factory->f_address;
                    $f->phone = $factory->f_phone;
                    $f->info = $factory->f_info;
                    $f->licencePaid = $factory->f_licence_paid;

                    $response[$f->id] = $f;
                }

                return $response;
            });

    }
}
