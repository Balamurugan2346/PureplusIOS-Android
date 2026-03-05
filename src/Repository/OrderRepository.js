import { calculateDeposit , placeOrder , cancelOrder} from '../API/Services/OrderService';

export const OrderRepository = {
    calculateDeposit: async (totalUnits) => {
        console.log("called from redux")
        try {
            const response = await calculateDeposit(totalUnits)
            return response.data
        } catch (e) {
            console.log("error while calculating deposit", e)
            throw e
        }
    },

    placeOrder: async (orderDetails) => {
        console.log("called from redux")
        try {
            const response = await placeOrder(orderDetails)
            return response.data
        } catch (e) {
            console.log("error while placing order", e)
            throw e
        }
    },

     cancelOrder: async (id) => {
        console.log("called from redux")
        try {
            const response = await cancelOrder(id)
            return response.data
        } catch (e) {
            console.log("error while cancelling order", e)
            throw e
        }
    },
}