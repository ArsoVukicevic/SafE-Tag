<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Service;

use Intervention\Image\ImageManager;

/**
 * Description of ImageService
 *
 * @author milos
 */
class ImageService
{

    private $_manager;

    public function __construct()
    {
        $this->_manager = new ImageManager();
    }

    public function save($imgUrl, $pName = null, $width = 250, $height = 200)
    {
        $name = is_null($pName) ? $this->_getName($imgUrl) : $pName;
        $make = $this->_manager->make($imgUrl);

        $make->resize($width, $height)->save(public_path('images/') . $name);

        return $name;
    }

    private function _getName($image)
    {
        return time() . '.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
    }

}
