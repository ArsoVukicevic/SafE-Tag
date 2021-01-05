<?php

namespace App\Service;

use App\Model\Response\ClassificationResponse;

class BreadcrumbsService {
    private $_breadcrumbs = [];
    private $_found = false;

    public function breadcrumbs(ClassificationResponse $node, int $needle) {
        if (empty($node->getChildrens())) {
            $this->_breadcrumbs[] = $node->getName();
        } else {
            $this->_searchInTree($node, $needle);
        }

        return $this->_breadcrumbs;
    }

    private function _searchInTree(ClassificationResponse $node, int $needle) {
        if (!empty($node->getChildrens())) {
            $this->_breadcrumbs[] = $node->getName();
            foreach ($node->getChildrens() as $children) {
                if ($children->getId() == $needle) {
                    $this->_breadcrumbs[] = $children->getName();
                    $this->_found = true;
                        break;
                }
            }
        }

        foreach ($node->getChildrens() as $children) {
            if (!$this->_found) {
                $this->_searchInTree($children, $needle);
            }
            break;
        }
    }
}
