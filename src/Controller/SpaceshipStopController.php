<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class SpaceshipStopController extends AbstractController
{
    /**
     * @Route("/", name="spaceship_stop")
     */
    public function index()
    {
        return $this->render('spaceship-stop/index.html.twig');
    }
}
