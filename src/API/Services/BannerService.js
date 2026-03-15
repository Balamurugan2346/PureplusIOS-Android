import apiClient from '../Client';
import endpoints from '../EndPoint';


export const getAllBanners = () => {
    return apiClient.get(endpoints.GETALLBANNERS)
}

export const getCustomerSupportDetails = () => {
    return apiClient.get(endpoints.CUSTOMER_SUPPORT)
}
