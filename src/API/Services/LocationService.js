import mapApiClient from '../MapClient';
import endpoints from '../EndPoint';
import axios from 'axios';
// import {FREE_GEO_FENCING_APIKEY} from '@env'

// ─────────────────────────────────────────────────────────────────────────────
// CURRENT: Geoapify (client-side) — kept LIVE for the demo.
// ⚠️ The key below is hardcoded and client-exposed; it is removed when we cut over to the backend.
//    Geocoding will move to the Pureplus backend (Google Maps, metered + IP-restricted key).
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE BACKEND SWAP (DORMANT — do not enable until the backend endpoints + a paid Google
// key exist; see projectdocuments/04_Google_Maps_Geocoding.md and src/API/modules/GeoService.js).
//
// When going live:
//   1) delete the Geoapify MAP_API_KEY + the two functions above + src/API/MapClient.js,
//   2) uncomment the block below, and have callers use these (same getAddress/autoCompleteAddress
//      signatures so call sites don't change),
//   3) handle { success:false, fallback:'manual_entry' } by showing the CUS-07 manual entry path.
//
// import GeoService from '../modules/GeoService';
//
// // Reverse geocode a settled map pin -> { formattedAddress, pincode, city, state }.
// // NOTE: Google forward/reverse geocoding has NO autocomplete — autocomplete is a separate paid
// // Places SKU. For v1 we drop live autocomplete and forward-geocode the full typed address instead.
// export const getAddress = (lat, long) => {
//     return GeoService.reverseGeocode(lat, long); // GET /api/customer/geo/reverse?lat=&lng=
// };
//
// export const autoCompleteAddress = (query) => {
//     return GeoService.forwardGeocode(query);     // GET /api/customer/geo/forward?address=
// };
// ─────────────────────────────────────────────────────────────────────────────


