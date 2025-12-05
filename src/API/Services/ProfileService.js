import apiClient from '../Client';
import endpoints from '../EndPoint';


export const getUserProfile = () => {
    return apiClient.get(endpoints.GETUSERPROFILE)
}


export const updateProfile =(profileData) => {
    return apiClient.put(endpoints.UPDATEUSERPROFILE,profileData)
}
