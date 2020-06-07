import React, { useState, useContext } from 'react';
import axios from "axios";
import CustomersService from '../services/CustomersService';
import authAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';
const LoginPage = ({history}) => {
    const {setIsAuthenticated}=useContext(AuthContext);
    const [credentials,setCredentials]=useState({
        username:"",
        password:""
        });
        const [error,setError]=useState("");


        //Gestion des champs
        const handleChange=({currentTarget})=>{
           const{value,name}=currentTarget;
            setCredentials(({...credentials,[name]:value}))
        };


        //Gestion du submit
        const handleSubmit = async event=>{
            event.preventDefault();

            try {
           await authAPI.authentificate(credentials);
           setError("");
           setIsAuthenticated(true);
           history.replace("/customers")
            
            } catch (error) {
            
                setError("Aucun compte ne possede cette adresse ou alors les informations ne correspondent pas");
            }
        }
    return ( <>
<h1>Connexion à l'application</h1>
<form onSubmit={handleSubmit}>
   <Field label="Adresse Email" name="username" onChange={handleChange} placeholder="Adresse Email utilisateur" value={credentials.username} error={error} />
   <Field name="password" label="Mot de passe" value={credentials.password}  onChange={handleChange} type="password" />
    <div className="form-group">
        <button type="submit" className="btn btn-success">
        Je me connecte</button>
    </div>

       
</form>
    </> );
}
 
export default LoginPage;