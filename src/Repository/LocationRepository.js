import { getAddress,autoCompleteAddress} from '../API/Services/LocationService';

export const LocationRepository = {
    getAddress: async (lat,long) => {
        try {
            const response = await getAddress(lat,long)
            return response.data
        } catch (e) {
            console.log("error while getting decoded address", e)
            throw e
        }
    },

      autoCompleteAddress: async (query) => {
        try {
            const response = await autoCompleteAddress(query)
            return response.data
        } catch (e) {
            console.log("error while autocomplete decoded address", e)
            throw e
        }
    }
}