import React,{useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import Axios from "axios";
import CustomersService from '../services/CustomersService';

const CustomerPage = ({match,history}) => {
    const {id="new"}=match.params;
  const [customer,setCustomer]=useState({
      lastName:"",
      firstName:"",
      email:"",
      company:""

  });

  const [error,setError]=useState({
    lastName:"",
    firstName:"",
    email:"",
    company:""});
    const [editing,setEditing]=useState(false); 

    const  fetchCustomer=async id=>{
        try {
            const {firstName,lastName,email,company}= await CustomersService.find(id);
            setCustomer({firstName,lastName,email,company})
        }catch(error) {
             console.log(error.response);
             history.replace("/customers");
        }
    };
    useEffect(()=>{
        if (id!=="new"){
            setEditing(true);
            fetchCustomer(id)
        }
    },[id]);

 const handleChange=({currentTarget})=>{
const {name,value}=currentTarget;
setCustomer({...customer,[name]:value})
    };

 const handleSubmit=async event=>{
   event.preventDefault();
   
   try {
        if (editing) {
           await  
            CustomersService.update(id,customer);
           ///// notification de succesc
           history.replace("/customers");
        }else{
           await  CustomersService.create(customer);
        }

      
        setError({})
   }catch ({response}) {
       const {violations}=response.data
       if(violations){
           const apiErrors={};
          violations.forEach(({propertyPath,message})=>{
               apiErrors[propertyPath]=message;
           });
           setError(apiErrors);
           console.log(apiErrors)
       }
   }

 };
    return ( <>
        {(!editing && <h1>Creation d'un client</h1>)||
        (<h1>Modification d'un client</h1>)}
        <form onSubmit={handleSubmit}>
            <Field error={error.lastName}  onChange={handleChange} value={customer.lastName} name="lastName"  label="Nom de famille" placeholder="Nom de famille du client" />
            <Field error={error.firstName}  onChange={handleChange} value={customer.firstName} name="firstName" label="prenom de famille" placeholder="prenom de famille du client" />
            <Field error={error.email}  onChange={handleChange} value={customer.email} name="email" label="Adresse email" placeholder="Adresse email du client" type="email" />
            <Field error={error.company}  onChange={handleChange} value={customer.company} name="company" label="Entrprise" placeholder="Entreprise du client" />
            <div className="form-group">
                <button className="btn btn-success">Enregistrer</button>
                <Link to={'/customers'} className="btn btn-link ">Retour a la liste</Link>
            </div>
        </form>
    </> );
};
 
export default CustomerPage;