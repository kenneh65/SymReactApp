import React, {useEffect, useState} from 'react';
import Pagination from '../components/Pagination';
import ServiceCustomers from '../services/CustomersService';
import { Link } from 'react-router-dom';
const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    //Permet de recuperer les customers
    const fetchCustomers = async () => {
        try {
            const data = await ServiceCustomers.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
        }
    }
    // Chercher  les customer au chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);


    // Permet la supression d'un customer
    const handleDelete = async id => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));
        try {
            await ServiceCustomers.delete(id)
        } catch (error) {
            setCustomers(originalCustomers);
        }
    };

    /// Gestion sur changement de page
    const handlePageChange = page => setCurrentPage(page);
    /// Gestion de la recherche par mot cle
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }
    const itemsPerPage = 10;

    ///filtrage de customers en fonction de la recherche par mot cle
    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );
    /// Pagination des donnees
    const paginateCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage);
    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des clients</h1>
            <Link className="btn btn-primary" to="/customers/new">Créer un client</Link>
            </div>
           
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder="Rechercher ..."/>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

                {paginateCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <a href="#">{customer.lastName} - {customer.firstName}</a>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-primary">{customer.invoices.length}</span>

                        </td>
                        <td className="text-center">{customer.totalAmount.toLocaleString()} GNF</td>
                        <td>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-danger">suprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {itemsPerPage < filteredCustomers.length && (<Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}/>
            )}
        </>
    );
}

export default CustomersPage;