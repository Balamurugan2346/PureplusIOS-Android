import apiClient from '../Client';
import endpoints from '../EndPoint';


export const getAllSlots = () => {
    return apiClient.get(endpoints.GETALLSLOTS)
}
