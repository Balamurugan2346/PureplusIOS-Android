import mapApiClient from '../MapClient';
import endpoints from '../EndPoint';
import axios from 'axios';
// import {FREE_GEO_FENCING_APIKEY} from '@env'


export const getAddress = (lat,long) => {
    return mapApiClient.get(endpoints.REVERSEGEOCODER,{
        params:{
            lat  : lat,
            lon : long,
            apiKey:"c18243557901458382f201562d908f68"
        }
    })
}


