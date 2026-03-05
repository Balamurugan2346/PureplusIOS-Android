import apiClient from '../Client';
import endpoints from '../EndPoint';


export const calculateDeposit = (totalUnits) => {
  return apiClient.post(endpoints.CALCULATE_DEPOSIT,totalUnits);
};


export const placeOrder = (orderDetails) => {
  return apiClient.post(endpoints.ORDER_PLACE, orderDetails);
};

export const refillBalance  = ()=>{
  return apiClient.get(endpoints.REFILL_BALANCE);
}

export const getSubscriptionPlans =()=> {
  return apiClient.get(endpoints.GETSUBSCRIPTIONPLANS);
}

export const placeOrderSubscription = (subscriptionDetails) => {
  return apiClient.post(endpoints.PLACESUBSCRIPTIONORDER, subscriptionDetails);
}

export const cancelOrder = (id) => {
  return apiClient.post(`${endpoints.CANCEL_ORDER}/${id}`);
};


