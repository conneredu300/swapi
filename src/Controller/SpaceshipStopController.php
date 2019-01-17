<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use SWAPI\SWAPI;

class SpaceshipStopController extends AbstractController
{
    /**
     * @Route("/spaceship", name="spaceship_stop")
     */
    public function index()
    {
        $swapi = new SWAPI;

        foreach($swapi->starships()->index() as $ship){
            print_r($ship);
            die();
        }

        return $this->render('spaceship-stop/index.html.twig');
    }
}
