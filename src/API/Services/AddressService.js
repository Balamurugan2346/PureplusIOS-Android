import apiClient from '../Client';
import endpoints from '../EndPoint';


export const saveAddress = (address) => {
    console.log(`"called from service"${endpoints.CREATEADDRESS} ${address}`)
  return apiClient.post(endpoints.CREATEADDRESS,address);
};


export const getAllAddress = (userId)=>{
    return apiClient.get(`${endpoints.GETALLUSERADDRESS}/${userId}`)
    //`${endpoints.GETALLUSERADDRESS}/${userId}`
}

export const deleteAddress = (id) => {
  return apiClient.post(`${endpoints.DELETEADDRESS}/${id}`)
}
