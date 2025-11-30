import { getAddress } from '../API/Services/LocationService';

export const LocationRepository = {
    getAddress: async (lat,long) => {
        try {
            const response = await getAddress(lat,long)
            return response.data
        } catch (e) {
            console.log("error while getting decoded address", e)
            throw e
        }
    }
}