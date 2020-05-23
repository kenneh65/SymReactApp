import axios from "axios";

async function findAll() {
    const Response = await axios
        .get("http://localhost:8000/api/customers");
    return Response.data['hydra:member'];
}

function deleteCustomer(id) {
    axios
        .delete("http://localhost:8000/api/customers/" + id);
}

export default {
    findAll,
    delete: deleteCustomer
};