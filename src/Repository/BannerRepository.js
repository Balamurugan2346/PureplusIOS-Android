import { getAllBanners } from '../API/Services/BannerService';

export const BannerRepoitory = {
    getBanners: async () => {
        try {
            // await new Promise(resolve => setTimeout(resolve, 155000));
            const response = await getAllBanners()
            return response.data
        } catch (e) {
            console.log("error while fetch banners", e)
            throw e
        }
    }
}