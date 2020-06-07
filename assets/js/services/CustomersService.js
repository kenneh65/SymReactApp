import axios from "axios";


async function findAll() {
    const Response = await axios
        .get("http://localhost:8000/api/customers");
    return Response.data['hydra:member'];
}

function find(id){
    return  axios
     .get("http://localhost:8000/api/customers/"+id)
     .then(response=>response.data);
     // Response;
}

function update(id,customer){
   return axios
    .put("http://localhost:8000/api/customers/"+id,customer);
}
function deleteCustomer(id) {
    axios
        .delete("http://localhost:8000/api/customers/" + id);
}

function create(customer){
    return axios.post("http://localhost:8000/api/customers",customer);
    history.replace("/customers");
}

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteCustomer
};