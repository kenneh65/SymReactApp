<?php
namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubcriber implements EventSubscriberInterface{
    private $security,$repository;

    public function __construct(Security $security,InvoiceRepository $repository)
    {
        $this->security=$security;
        $this->repository=$repository;
    }

    public static function getSubscribedEvents()
    {
        return[KernelEvents::VIEW=>['setChronoForInvoice',EventPriorities::PRE_VALIDATE]
    ];
    }
    public function setChronoForInvoice(ViewEvent $event){
       
        $invoice=$event->getControllerResult();
        $method=$event->getRequest()->getMethod();//POST,GET,DELETE ....
       
        if ($invoice instanceof Invoice && $method==='POST') {
            $nextChrno= $this->repository->findNextChrno($this->security->getUser());
            $invoice->setChrono(intval($nextChrno));
            $invoice->setSentAt(new DateTime());
        
        }
    }

}