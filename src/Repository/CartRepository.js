import { getCartItems } from '../API/Services/CartService';

export const CartRepository = {

     getCartItems: async (id) => {
        try {
            const response = await getCartItems(id)
            return response.data
        } catch (e) {
            console.log("error while fetch cart items", e)
            throw e
        }
    }
}





