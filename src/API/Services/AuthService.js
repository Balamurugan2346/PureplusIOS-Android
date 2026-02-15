import apiClient from '../Client';
import endpoints from '../EndPoint';


export const sendMobileNumber = (mobileNumber) => {
  return apiClient.post(endpoints.GETOTP, {
    mobileNumber
  });
};



export const verifyOTP = (mobileNumber, otp) => {
  return apiClient.post(endpoints.VERIFYOTP, {
    mobileNumber,
    otp
  });
};

export const createProfile =(fullName,email) => {
  return apiClient.post(endpoints.CREATEPROFILE,{
    fullName,
    email
  })
}
