import { getCartItems,updateCart,addToCart } from '../API/Services/CartService';

export const CartRepository = {

     getCartItems: async () => {
        try {
            const response = await getCartItems()
            return response.data
        } catch (e) {
            console.log("error while fetch cart items", e)
            throw e
        }
    },

    updateCart:async(cart)=>{
        try{
            const response = await updateCart(cart)
            return response.data
        }catch(e){
            console.log("error while updating cart")
            throw e
        }
    },

    
    addToCart:async(cart)=>{
        try{
            const response = await addToCart(cart)
            return response.data
        }catch(e){
            console.log("error while adding cart")
            throw e
        }
    },
}





