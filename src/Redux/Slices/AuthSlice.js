import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthRepository } from '../../Repository/AuthRepository';

// ✅ Send Mobile Number
export const sendMobileNumber = createAsyncThunk(
    'auth/sendMobileNumber',
    async ({ mobileNumber, otp }, { rejectWithValue }) => {
        try {
            const { data } = await AuthRepository.sendMobileNumber(mobileNumber, otp);
            console.log('data sent', mobileNumber);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ✅ Login
export const Login = createAsyncThunk(
    'auth/Login',
    async ({ mobileNumber, otp }, { rejectWithValue }) => {
        try {
            const { data } = await AuthRepository.Login(mobileNumber, otp);
            console.log('login data', data);
            return data;
        } catch (err) {
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
        },
        // login state
        loginState: {
            loading: false,
            isFetched: false,
            isSuccess: false,
            error: null,
            loginData: null,
        },
    },
    reducers: {
        saveNumberLocally: (state, action) => {
            state.sendMobile.mobileNumber = action.payload;
        },
        clearSavedNumber: (state) => {
            state.sendMobile.mobileNumber = null;
        },
        clearError: (state) => {
            state.sendMobile.error = null;
            state.loginState.error = null;
        },
        clearState: (state) => {
            // reset sendMobile state
            state.sendMobile = {
                loading: false,
                isFetched: false,
                isSuccess: false,
                error: null,
                mobileNumber: null,
            };
            // reset login state
            state.loginState = {
                loading: false,
                isFetched: false,
                isSuccess: false,
                error: null,
                loginData: null,
            };
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
            .addCase(sendMobileNumber.fulfilled, (state) => {
                state.sendMobile.loading = false;
                state.sendMobile.isFetched = true;
                state.sendMobile.isSuccess = true;
                state.sendMobile.error = null;
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

export const { saveNumberLocally, clearState, clearError } = authSlice.actions;
export default authSlice.reducer;
