import axios from "axios";

function update(id,invoice){
    return axios.put("http://localhost:8000/api/invoices/"+id,{...invoice,
    customer: `/api/customers/${invoice.customer}`});
 }

 function create(invoice){
    return axios.post("http://localhost:8000/api/invoices",{...invoice,
    customer: `/api/customers/${invoice.customer}`});
    
}

async function findAll() {
    const Response = await axios
        .get("http://localhost:8000/api/invoices");
    return Response.data['hydra:member'];
}

function find(id){
    return  axios
     .get("http://localhost:8000/api/invoices/"+id)
     .then(response=>response.data);
     // Response;

}

function deleteInvoice(id) {
    axios.delete("http://localhost:8000/api/invoices/" + id);
}
export default {
    findAll,
    update,
    create,
    find,
    delete:deleteInvoice
};