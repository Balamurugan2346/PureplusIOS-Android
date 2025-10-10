import apiClient from '../Client';
import endpoints from '../EndPoint';


export const getAllProducts = () => {
    return apiClient.get(endpoints.GETALLPRODUCTS)
}

export const getProductById =(id) => {
    return apiClient.get(`${endpoints.GETPRODUCTBYID}?Sl_No=${id}`)
}
