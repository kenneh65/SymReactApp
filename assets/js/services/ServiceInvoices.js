import axios from "axios";

async function findAll() {
    const Response = await axios
        .get("http://localhost:8000/api/invoices");
    return Response.data['hydra:member'];
}

function deleteInvoice(id) {
    axios.delete("http://localhost:8000/api/invoices/" + id);
}
export default {
    findAll,
    delete:deleteInvoice
};