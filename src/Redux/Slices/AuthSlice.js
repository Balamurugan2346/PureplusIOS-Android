import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthRepository } from '../../Repository/AuthRepository';

// ✅ Send Mobile Number
export const sendMobileNumber = createAsyncThunk(
    'auth/sendMobileNumber',
    async ({ mobileNumber, onSuccess, onError }, { rejectWithValue }) => {
        try {
            const response = await AuthRepository.sendMobileNumber(mobileNumber);

            // If API returns { data: {...} }
            const result = response?.data ?? response;

            if (onSuccess) onSuccess(result);

            return result;
        } catch (err) {
            if (onError) onError(err)
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);


// ✅ Login
export const Login = createAsyncThunk(
    'auth/verifyOTP',
    async ({ mobileNumber, otp, onSuccess, onError }, { rejectWithValue }) => {
        try {
            const response = await AuthRepository.verifyOTP(mobileNumber, otp);
            console.log('verify OTP Data', response);
            // If API returns { data: {...} }
            const result = response?.data ?? response;

            if (onSuccess) onSuccess(result);

            return result;
        } catch (err) {
            if (onError) onError(err)
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);



const authSlice = createSlice({
    name: 'Authentication',
    initialState: {
        // sendMobileNumber state
        sendMobile: {
            loading: false,
            isFetched: false,
            isSuccess: false,
            error: null,
            mobileNumber: null,
            otp: ''
        },
        // login state
        loginState: {
            loading: false,
            isFetched: false,
            isSuccess: false,
            error: null,
            isNewUser: false,
            loginData: null,
        },
    },
    reducers: {
        saveMobileNumberLocally: (state, action) => {
            state.sendMobile.mobileNumber = action.payload;
        },
        clearSavedNumber: (state) => {
            state.sendMobile.mobileNumber = null;
            state.sendMobile.otp = ''
        },
        clearError: (state) => {
            state.sendMobile.error = null;
            state.loginState.error = null;
        },
        clearIsFetched: (state) => {
            state.sendMobile.isFetched = false
        },
        clearState: (state) => {
            state.sendMobile = { loading: false, isFetched: false, isSuccess: false, error: null, mobileNumber: null, otp: '' };
            // reset login state
            state.loginState = { loading: false, isFetched: false, isSuccess: false, error: null, loginData: null, };
        },
    },
    extraReducers: (builder) => {
        builder
            // ✅ sendMobileNumber cases
            .addCase(sendMobileNumber.pending, (state) => {
                state.sendMobile.loading = true;
                state.sendMobile.isFetched = false;
                state.sendMobile.isSuccess = false;
                state.sendMobile.error = null;
            })
            .addCase(sendMobileNumber.fulfilled, (state, action) => {
                state.sendMobile.loading = false;
                state.sendMobile.isFetched = true;
                state.sendMobile.isSuccess = true;
                state.sendMobile.error = null;
                state.sendMobile.otp = action.payload.otp
            })
            .addCase(sendMobileNumber.rejected, (state, action) => {
                state.sendMobile.loading = false;
                state.sendMobile.isFetched = true;
                state.sendMobile.isSuccess = false;
                state.sendMobile.error = action.payload;
            })

            // ✅ Login cases
            .addCase(Login.pending, (state) => {
                state.loginState.loading = true;
                state.loginState.isFetched = false;
                state.loginState.isSuccess = false;
                state.loginState.error = null;
            })
            .addCase(Login.fulfilled, (state, action) => {
                state.loginState.loading = false;
                state.loginState.isFetched = true;
                state.loginState.isSuccess = true;
                state.loginState.loginData = action.payload;
                state.loginState.isNewUser = action.payload.isNewUser
                state.loginState.error = null;
            })
            .addCase(Login.rejected, (state, action) => {
                state.loginState.loading = false;
                state.loginState.isFetched = true;
                state.loginState.isSuccess = false;
                state.loginState.loginData = null;
                state.loginState.error = action.payload;
            });
    },
});

export const { saveMobileNumberLocally, clearState, clearError, clearIsFetched } = authSlice.actions;
export default authSlice.reducer;
