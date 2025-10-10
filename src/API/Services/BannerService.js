import apiClient from '../Client';
import endpoints from '../EndPoint';


export const getAllBanners = () => {
    return apiClient.get(endpoints.GETALLBANNERS)
}
