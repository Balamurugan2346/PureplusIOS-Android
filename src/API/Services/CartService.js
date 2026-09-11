import apiClient from '../Client';
import endpoints from '../EndPoint';

export const getCartItems = ()=>{
    return apiClient.get(`${endpoints.GETCART}`) 
}


export const updateCart = (cart) => {
  return apiClient.post(endpoints.UPDATECART,cart);
};

export const addToCart =(cart)=>{
    return apiClient.post(endpoints.ADDTOCART,cart)
}

export const getCartCount = () => {
    return apiClient.get(endpoints.CARTCOUNT)
}

export const removeFromCart = (id) => {
    return apiClient.delete(`${endpoints.REMOVEFROMCART}/${id}`)
}