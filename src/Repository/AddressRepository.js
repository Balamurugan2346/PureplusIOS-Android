import { saveAddress , getAllAddress } from '../API/Services/AddressService';

export const AddressRepository = {
    saveAddress: async (address) => {
        console.log("called from redux")
        try {
            const response = await saveAddress(address)
            return response.data
        } catch (e) {
            console.log("error while save address", e)
            throw e
        }
    },

    getAllAddress : async (userId)=> {
        try{
            const response = await getAllAddress(userId)
            return response.data
        }catch(e){
            console.log("error while getting all address")
            throw e
        }
    }
}