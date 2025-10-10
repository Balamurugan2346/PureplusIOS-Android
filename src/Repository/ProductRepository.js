import { getAllProducts, getProductById } from '../API/Services/ProductsService';

export const ProductRepository = {
    getProducts: async () => {
        try {
            // await new Promise(resolve => setTimeout(resolve, 155000));
            const response = await getAllProducts()
            return response.data
        } catch (e) {
            console.log("error while fetch products", e)
            throw e
        }
    },

     GetProductById: async (id) => {
        try {
            // await new Promise(resolve => setTimeout(resolve, 155000));
            const response = await getProductById(id)
            return response.data
        } catch (e) {
            console.log("error while fetch detailedProducts", e)
            throw e
        }
    }
}





