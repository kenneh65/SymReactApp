import React, {useEffect, useState} from 'react';
import Pagination from '../components/Pagination';
import axios from "axios";
import moment from "moment";
import ServiceCustomers from "../services/CustomersService";
import ServiceInvoices from "../services/ServiceInvoices";
import { Link } from 'react-router-dom';

const STATUS_CLASSE = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};
const STATUS_LABELS = {
    PAID: "Payee",
    SENT: "Envoyee",
    CANCELLED: "Annullee"
};
const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const fetchInvoices = async () => {
        try {
            const data = await ServiceInvoices.findAll();
            setInvoices(data);
        } catch (e) {
            console.log(e.response)
        }
    };


    useEffect(() => {
        fetchInvoices();
    }, []);

    // Permet la supression d'un customer
    const handleDelete = async id => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        try {
            await ServiceInvoices.delete(id)
        } catch (error) {
            setInvoices(originalInvoices);
            console.log('error');
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
    const filteredInvoices = invoices.filter(i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
         // STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())||
        i.amount.toString().startsWith(search.toLowerCase()));

    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    /// Pagination des donnees
    const paginateInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage);
    return (
        <>
           

            <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des Factures</h1>
            <Link className="btn btn-primary" to="/invoices/new">Créer un Factures</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder="Rechercher ..."/>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Nuemero</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>

                {paginateInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.id}</td>
                        <td>
                            <a href="#">{invoice.customer.lastName} - {invoice.customer.firstName}</a>
                        </td>
                        <td>{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span
                                className={"badge badge-" + STATUS_CLASSE[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>

                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} GNF</td>
                        <td>
                        <Link
                               to={"/invoices/"+invoice.id}
                                className="btn btn-primary btn-sm mr-1">
                                Editer
                        </Link>
                            <button
                                onClick={() => handleDelete(invoice.id)}
                                className="btn  btn-sm btn-danger">
                                suprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredInvoices.length}
                onPageChanged={handlePageChange}
            />
        </>
    );
};


export default InvoicesPage;
