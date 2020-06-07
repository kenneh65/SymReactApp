import React from 'react';
import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from '../config';

function logout(){
    window.localStorage.removeItem('authToken');
    delete axios.defaults.headers['Authorization'];
}

function authentificate(credentials){
  return    axios
    .post(LOGIN_API, credentials)
    .then(response=>response.data.token)
    .then(token=>{
        //on stocke le token dans le local storage
        window.localStorage.setItem("authToken",token);
        // On previen a axios qu'on a maintenant un Header par defaut pour toute nos future requete HTTP
        setAxiosToken(token);
        return true;
    });
    
}
function setAxiosToken(token){
    axios.defaults.headers["Authorization"]="Bearer "+token;
}

function setup(){
    const token=window.localStorage.getItem("authToken");
if (token) {
    const {exp:expiration}=jwtDecode(token);
    if (expiration*1000> new Date().getTime()) {
        setAxiosToken(token)
    }
}    
}
export default {
    authentificate,
    logout,
    setup
}