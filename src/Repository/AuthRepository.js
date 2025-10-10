import { Login, sendMobileNumber } from '../API/Services/AuthService';

export const AuthRepository = {
    sendMobileNumber: async (mobileNumber,otp) => {
        try {
            const response = await sendMobileNumber(mobileNumber,otp)
            return response.data
        } catch (e) {
            console.log("error while send mobile number", e)
            throw e
        }
    },

    Login: async (mobileNumber,otp) => {
        try {
            const response = await Login(mobileNumber,otp)
            return response.data
        } catch (e) {
            console.log("error while Login", e)
            throw e
        }
    },
}