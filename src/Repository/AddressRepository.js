import { saveAddress , getAllAddress , deleteAddress , updateAddress } from '../API/Services/AddressService';

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

    updateAddress: async (address) => {
        try {
            const response = await updateAddress(address)
            return response.data
        } catch (e) {
            console.log("error while updating address", e)
            throw e
        }
    },

    getAllAddress : async ()=> {
        try{
            const response = await getAllAddress()
            return response.data
        }catch(e){
            console.log("error while getting all address")
            throw e
        }
    },

    deleteAddress : async (id)=> {
        try{
            const response = await deleteAddress(id)
            return response.data
        }catch(e){
            console.log("delte error from repo")
            throw e
        }
    }
}