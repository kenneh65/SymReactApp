import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersService from '../services/CustomersService';
import Axios from 'axios';
import ServiceInvoices from '../services/ServiceInvoices';
import { toast } from 'react-toastify';
import FormContentLoader from '../components/loaders/FormContentLoader';
const InvoicePage = ({history,match}) => {
    const {id="new"}=match.params;
    const [loading,setLoading]=useState(true)
    const [invoice,setInvoice]=useState({
        amount:"",
        customer:"",
        status:"SENT"
    });
    const [customers, setCustomers] = useState([]);
    const [editing,setEditing]=useState(false); 
    const [errors,setErrors]=useState({
        amount:"",
        customer:"",
        status:""});

        const  fetchCustomers=async() =>{
            try {
               const data= await CustomersService.findAll();
                setCustomers(data);
                setLoading(false);
                if (!invoice.customer) {
                    setInvoice({...invoice,customer:data[0].id})
                }
            }catch(errors) {
                 console.log(errors.response);
                 toast.error("Impossible de charger les clients")
                 history.replace("/invoices")
            }
        };

        const  fetchInvoice=async (id)=>{
            try {
                const {amount,status,customer}=await ServiceInvoices.find(id);
               setInvoice({amount,status,customer:customer.id});
               setLoading(false);
            }catch(error) {
                 console.log(error.response)
                 toast.error("Impossible de charger la facture demandee")
                 history.replace("/invoices")
            }
        };
        
        useEffect(()=>{
            fetchCustomers()
        },[]);
    
        useEffect(()=>{
            if (id!=="new"){
                setEditing(true);
                fetchInvoice(id)
            }
        },[id]);
    
        const handleChange=({currentTarget})=>{
            const {name,value}=currentTarget;
            setInvoice({...invoice,[name]:value})
                };
    
                const handleSubmit=async(event)=>{
                    event.preventDefault();
                    try {
                     if (editing) {
                       await ServiceInvoices.update(id,invoice);
                       toast.success("La facture a bien ete modifiee")
                     }else{

                        await ServiceInvoices.create(invoice)
                        toast.success("La facture a bien ete enregistree")
                        history.replace("/invoices")
                     }

                    }catch ({response}) {
                        const {violations}=response.data
                        if(violations){
                            const apiErrors={};
                            violations.forEach(({propertyPath,message})=>{
                                apiErrors[propertyPath]=message;
                            });
                            setErrors(apiErrors);
                            toast.error("Des erreurs dans votre formulaire")
                            console.log(apiErrors)
                        }
                    }
                }


    return ( <>
  
     {(!editing && <h1>Creation d'une facture</h1>)||
        (<h1>Modification d'une facture</h1>)}
         {loading&&  <FormContentLoader/>}
   {!loading&& <form onSubmit={handleSubmit}>
        <Field name="amount" type="number" placeholder="Montant de la facture" label="Montant"
         onChange={handleChange} value={invoice.amount} error={errors.amount} />

         <Select   name="customer" label="Client" 
          value={invoice.customer} error={errors.customer} onChange={handleChange}>
              {customers.map(customer=>
                  <option  key={customer.id} value={customer.id} > {customer.firstName} {customer.lastName} </option>
              )}
        </Select>

        <Select id="status" name="status" label="Status" value={invoice.status} error={errors.status} 
        onChange={handleChange} >
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
                <button className="btn btn-success">Enregistrer</button>
                <Link to={'/invoices'} className="btn btn-link ">Retour a la liste</Link>
            </div>
    </form>}
    </> );
}
 
export default InvoicePage;