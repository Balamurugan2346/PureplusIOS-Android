  
  import {getData} from '../OfflineStore/OfflineStore'
  
  export const getSelectedAddressId = async () => {
        try {
            const saved = await getData('selectedAddress');
            if (!saved) return -1;

            const parsed = JSON.parse(saved);
            console.log("parsed",parsed?.id)
            return parsed?.id ?? -1;
        } catch (e) {
            console.log("Error fetching selected address:", e);
            return -1;
        }
    };