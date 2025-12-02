import mapApiClient from '../MapClient';
import endpoints from '../EndPoint';
import axios from 'axios';
// import {FREE_GEO_FENCING_APIKEY} from '@env'


//SOON MOVE TO BACKEND
const MAP_API_KEY = "c18243557901458382f201562d908f68"

export const getAddress = (lat,long) => {
    return mapApiClient.get(endpoints.REVERSEGEOCODER,{
        params:{
            lat  : lat,
            lon : long,
            apiKey:MAP_API_KEY
        }
    })
}

export const autoCompleteAddress = (query) => {
    return mapApiClient.get(endpoints.AUTOCOMPLETEADDRESS,{
        params:{
            text:query,
            apiKey:MAP_API_KEY
        }
    })
}


