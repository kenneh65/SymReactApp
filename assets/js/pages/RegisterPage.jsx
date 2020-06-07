import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import userService from '../services/userService';
import { toast } from 'react-toastify';
const RegisterPage = ({history}) => {

const [user,setUser]=useState({
    firstName:'',
    lastName:'',  
    email:'',
    password:'',
    passwordConfirm:''
});
const [errors,setErrors]=useState({
    firstName:'',
    lastName:'',  
    email:'',
    password:'',
    passwordConfirm:''
});


const handleChange=({currentTarget})=>{
    const {name,value}=currentTarget;
    setUser({...user,[name]:value})
        };   
        const handleSubmit=async(event)=>{
            event.preventDefault();
            const apiErrors={};
            if (user.password!==user.passwordConfirm) {
                apiErrors.passwordConfirm="Votre mot de passe de confirmation n'est pas correcte";
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire")
                return;
                
            }


            try {
                 await userService.register(user)
                setErrors({});
                toast.success("Vous etes desormais inscrit, vous pouvez vous conecter !")
                history.replace("/login");
             }
            catch (error) {
               const {violations}= error.response.data;
               if(violations){
              
                   violations.forEach(violation=>{
                       apiErrors[violation.propertyPath]=violation.message;
                    });
                    toast.error("Des erreurs dans votre formulaire")
                   setErrors(apiErrors);
                }
            }
        };

    return ( 
        <>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
<Field name="firstName" label="Prenom"
             placeholder="Votre prenom" onChange={handleChange}
             error={errors.firstName} value={user.firstName}  />

<Field name="lastName" label="Nom de famille"
             placeholder="Votre nom" onChange={handleChange}
             error={errors.lastName} value={user.lastName}  />

<Field name="email" label="Votre adresse email"
             placeholder="Votre email" onChange={handleChange}
             error={errors.email} value={user.email} type="email"  />

<Field name="password" label="Mot de passe" type="password"
             placeholder="Votre mot de passe" onChange={handleChange}
             error={errors.password} value={user.password}  />

<Field name="passwordConfirm" label="Confirmation mot de passe" type="password"
             placeholder="Confirmer votre mot de passe" onChange={handleChange}
             error={errors.passwordConfirm} value={user.passwordConfirm}  />
             <div className="form-group"><button className="btn btn-success">Valider</button>
             <Link to={'/login'} className="btn btn-link ">Jai deja un compte</Link>
             </div>
           
        </form>
        </>
     );
}
 
export default RegisterPage;