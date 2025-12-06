
import { getData } from '../OfflineStore/OfflineStore'

export const getSelectedAddressId = async () => {
    try {
        const savedID = await getData('selectedAddressID');
        if (savedID === null || savedID === undefined) return -1;

        return savedID;
    } catch (e) {
        console.log("Error fetching selected address:", e);
        return -1;
    }
};


export const getSelectedAddress = async () => {
    try {
        const saved = await getData('selectedAddress');
        if (!saved) return {};

        const parsed = JSON.parse(saved);
        console.log("parsed", parsed)
        return parsed ?? {};
    } catch (e) {
        console.log("Error fetching selected address:", e);
        return -1;
    }
};