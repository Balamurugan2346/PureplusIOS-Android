import apiClient from '../Client';
import endpoints from '../EndPoint';

export const getCartItems = (userId)=>{
    return apiClient.get(`${endpoints.GETCART}/${userId}`)
}


