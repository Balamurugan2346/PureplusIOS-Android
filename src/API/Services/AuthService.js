import apiClient from '../Client';
import endpoints from '../EndPoint';


export const sendMobileNumber = (mobileNumber, otp) => {
  return apiClient.post(endpoints.SENDMOBILENUMBER, {
    mobileNumber,
    otp
  });
};

export const Login = (mobileNumber, otp) => {
  return apiClient.post(endpoints.LOGIN, {
    mobileNumber,
    otp
  });
};