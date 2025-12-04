import { createProfile, sendMobileNumber , verifyOTP } from '../API/Services/AuthService';

export const AuthRepository = {
    sendMobileNumber: async (mobileNumber) => {
        try {
            const response = await sendMobileNumber(mobileNumber)
            return response.data
        } catch (e) {
            console.log("error while send mobile number", e)
            throw e
        }
    },

    verifyOTP: async (mobileNumber,otp) => {
        try {
            const response = await verifyOTP(mobileNumber,otp)
            return response.data
        } catch (e) {
            console.log("error while verify otp", e)
            throw e
        }
    },

    createProfile : async (fullName,email) =>{
        try{
            const response = await createProfile(fullName,email)
            return response.data
        }catch(e){
            console.log("error creating profile")
        }
    }
}