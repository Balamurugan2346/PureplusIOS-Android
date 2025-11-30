import mapApiClient from '../MapClient';
import endpoints from '../EndPoint';
// import {FREE_GEO_FENCING_APIKEY} from '@env'


export const getAddress = (lat,long) => {
    return mapApiClient.get(endpoints.REVERSEGEOCODER,{
        params:{
            lat  : lat,
            lon : long,
            api_key:"692c090b6b947545069939frc560e72"
        }
    })
}

