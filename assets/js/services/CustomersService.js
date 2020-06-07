import axios from "axios";
import cache from "./cache";
import { CUSTOMERS_API } from "../config";


async function findAll() {
    const cachedCustomers= await cache.get("customers");
    if (cachedCustomers) return cachedCustomers;
    return axios
        .get(CUSTOMERS_API)
        .then(response=>{
            const customers=response.data['hydra:member'];
            cache.set("customers",customers);
            return customers
        });
}

async function find(id){
    const cachedCustomer=await cache.get("customers."+id);
    if(cachedCustomer) return cachedCustomer;
    return  axios
     .get(CUSTOMERS_API+"/"+id)
     .then(response=>{
         const customer=response.data;
         cache.set("customers."+id,customer);
         return customer
     });
     // Response;
}

function update(id,customer){
   return axios
    .put(CUSTOMERS_API+"/"+id,customer).then(async response=>{
        const cachedCustomers=await cache.get("customers");
        const cachedCustomer=await cache.get("customers."+id);
        if(cachedCustomer) {
            cache.set("customers."+id,response.data)
        }
    if(cachedCustomers){
        const index=cachedCustomers.findIndex(c=>c.id===+id);
        cachedCustomers[index]=response.data;
    }
    return response;
    })
}
 function deleteCustomer(id) {
   
   return axios.delete(CUSTOMERS_API+"/"+id).then(async response=>{
    const cachedCustomers=await cache.get("customers");
    if(cachedCustomers){
     cache.set("customers",cachedCustomers.filter(c=>c.id!==id));
    }
    return response;
   })
}

function create(customer){
    return axios.post(CUSTOMERS_API,customer).then(async response=>{
        const cachedCustomers=await cache.get("customers");
        if(cachedCustomers){
            cache.set("customers",[...cachedCustomers,response.data]);
           }
           return response;
    })
    history.replace("/customers");
}

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteCustomer
};