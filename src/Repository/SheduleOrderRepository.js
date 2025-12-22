import { getAllSlots } from '../API/Services/SheduleOrderService';

export const SheduleRepository = {
    getAllSlots: async () => {
        try {
            const response = await getAllSlots()
            console.log("response:",response)
            return response.data
        } catch (e) {
            console.log("error while fetch slots", e)
            throw e
        }
    }
}