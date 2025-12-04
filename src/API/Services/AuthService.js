import apiClient from '../Client';
import endpoints from '../EndPoint';


export const sendMobileNumber = (mobileNumber) => {
  return apiClient.post(endpoints.GETOTP, {
    mobileNumber
  });
};



export const verifyOTP = (mobileNumber, otpCode) => {
  return apiClient.post(endpoints.VERIFYOTP, {
    mobileNumber,
    otpCode
  });
};

export const createProfile =(fullName,email) => {
  return apiClient.post(endpoints.CREATEPROFILE,{
    fullName,
    email
  })
}
