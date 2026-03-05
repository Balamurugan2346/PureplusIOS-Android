import apiClient from '../Client';
import endpoints from '../EndPoint';


export const saveAddress = (address) => {
    console.log(`"called from service"${endpoints.CREATEADDRESS} ${address}`)
  return apiClient.post(endpoints.CREATEADDRESS,address);
};


export const getAllAddress = ()=>{
    return apiClient.get(`${endpoints.GETALLUSERADDRESS}`)
    //`${endpoints.GETALLUSERADDRESS}/${userId}`
}

export const deleteAddress = (id) => {
  return apiClient.delete(`${endpoints.DELETEADDRESS}/${id}`)
}
