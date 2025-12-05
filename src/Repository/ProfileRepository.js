import { getUserProfile,updateProfile} from '../API/Services/ProfileService';

export const ProfileRepository = {
    getUserProfile: async () => {
        try {
            // await new Promise(resolve => setTimeout(resolve, 155000));
            const response = await getUserProfile()
            return response.data
        } catch (e) {
            console.log("error while fetch user profile", e)
            throw e
        }
    },

    updateUserProfile : async (profileData) => {
        try{
            const response = await updateProfile(profileData)
            return response.data
        }catch(e){
            console.log("error while updating the profile",e)
            throw e 
        }
    }
}