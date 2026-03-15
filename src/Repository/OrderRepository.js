import { calculateDeposit, placeOrder, cancelOrder, refillBalance,getCurrentOrder, getSubscriptionPlans, placeOrderSubscription, getOrderedDetailed, getAllOrders } from '../API/Services/OrderService';

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


    getOrderDetailed: async (id) => {
        try {
            const response = await getOrderedDetailed(id)
            return response.data
        } catch (e) {
            console.log("error while getting order detailed", e)
            throw e
        }
    },

    getAllOrders: async () => {
        try {
            const response = await getAllOrders()
            return response.data
        } catch (e) {
            throw e
        }
    },

      getCurrentOrder: async () => {
        try {
            const response = await getCurrentOrder()
            return response.data
        } catch (e) {
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

    //refill
    getRefillBalance: async () => {
        console.log("called from redux")
        try {
            const response = await refillBalance()
            return response.data
        } catch (e) {
            console.log("error while fetching refill balance", e)
            throw e
        }
    },


    //subscriptions

    getSubscriptionPlans: async () => {
        try {
            const response = await getSubscriptionPlans()
            return response.data
        } catch (e) {
            console.log("error while fetching subscription plans", e)
            throw e
        }
    },

    placeOrderSubscription: async (subscriptionDetails) => {
        try {
            const response = await placeOrderSubscription(subscriptionDetails)
            return response.data
        } catch (e) {
            console.log("error while placing subscription order", e)
            throw e
        }
    }

}