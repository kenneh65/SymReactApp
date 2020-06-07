// les import important
import React, { useState, useContext } from 'react';
import ReactDOM from "react-dom"
import '../css/app.css';
import '../css/bootswatch.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import {Switch, Route, HashRouter, Redirect, withRouter} from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from './pages/LoginPage';
import authAPI from './services/authAPI';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import CustomerPage from './pages/CustomerPage';
import InvoicePage from './pages/InvoicePage';
import RegisterPage from './pages/RegisterPage';

authAPI.setup();
const App = () => {
const [isAuthenticated,setIsAuthenticated]=useState(true);  
const NavBarWithRouter=withRouter(Navbar);
    return (
        <AuthContext.Provider value={ {
            isAuthenticated,
            setIsAuthenticated
        }}>
        <HashRouter>
            <NavBarWithRouter  />
            <main className="container pt-5">
                <Switch>
                <Route path="/login" component={LoginPage}/>
                    <Route path="/register"  component={RegisterPage}/>  
                   <PrivateRoute path="/invoices/:id"  component={InvoicePage}/>
                    <PrivateRoute path="/invoices"  component={InvoicesPage}/>
                    <PrivateRoute path="/customers/:id"  component={CustomerPage} />
                    <PrivateRoute path="/customers"  component={CustomersPage} />
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
        </AuthContext.Provider>
    );
};
const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);