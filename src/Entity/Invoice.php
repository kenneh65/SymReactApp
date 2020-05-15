<?php

namespace App\Entity;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints as Assert;
/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 *  @ApiResource(
 * subresourceOperations={
 * "api_customers_invoices_get_subresource"={
 *      "normalization_context"={"groups"={"invoices_subresource"}}
 *  }
 * },
 * itemOperations={"GET","PUT","DELETE","increment"={
 *   "method"="post",
 *    "path"="/invoices/{id}/increment",
 *    "controller"="App\Controller\InvoiceIncrementationController",
 *    "swagger_context"={
 *     "summary"="Incremente une facture",
 *     "description"= "Incremente le chrono d'une facture donnee"
 *     } 
 *   }
 * },
 * attributes={
 * "pagination_enabled"=true,
 * "pagination_items_per_page"=20,
 * "order":{"amount":"desc"}
 * },
 * normalizationContext={"groups"={"invoices_read"}},
 * denormalizationContext={"disable_type_enforcement"=true}
 * ) 
 * @ApiFilter(OrderFilter::class,properties={"amount","sentAt","chrono"})
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_resd","invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read","customers_resd","invoices_subresource"})
     * @Assert\Notblank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric",message="Le montant de la fature doit etre un numerique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read","customers_resd","invoices_subresource"})
     * @Assert\Notblank(message="La date d'envoi doit etre renseignee")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read","customers_resd","invoices_subresource"})
     * @Assert\Notblank(message="Le status de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT","PAID","CANCELLED"}, message="Le status doit etre SENT , PAID ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\Notblank(message="Le client de la facture doit etre renseigne")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_resd","invoices_subresource"})
     * @Assert\Notblank(message="Le chrono de la facture doit etre renseigne")
     * @Assert\Type(type="integer",message="Le chrono de la fature doit etre un nombre")
     */
    private $chrono;

    /**
     * Permet de recuperrer le user a qui appartient finalement la facture
     * @Groups({"invoices_read","invoices_subresource"})
     * @return User
     */
    public function getUser():User{
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt()
    {
        return $this->sentAt;
    }

    public function setSentAt( $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
