import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProfileRepository } from "../../Repository/ProfileRepository";

// ─────────────────────────────
// GET USER PROFILE
// ─────────────────────────────
export const getUserProfile = createAsyncThunk(
  "profile/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await ProfileRepository.getUserProfile();
      return data;
    } catch (err) {
      console.log("getUserProfile thunk error:", err);
      return rejectWithValue(err.message);
    }
  }
);


// UPDATE USER PROFILE
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({profileData,onSuccess,onError}, { rejectWithValue }) => {
    try {
      console.log("pass prof",profileData)
      const response = await ProfileRepository.updateUserProfile(profileData);

      // If API returns { data: {...} }
      const result = response?.data ?? response;

      if (onSuccess) onSuccess(result);

      return result;
    } catch (err) {
      onError(err)
      console.log("update profile thunk error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────
// SLICE
// ─────────────────────────────
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileData: null,   // stores full profile object
    loading: false,
    error: null,
    isFetched: false,    // helps avoid multiple API calls on home
  },

  reducers: {
    clearProfileState: (state) => {
      state.profileData = null;
      state.loading = false;
      state.error = null;
      state.isFetched = false;
    },
    saveProfileData:(state,action)=>{
      state.profileData = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      // ─────────── PENDING ───────────
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isFetched = false;
      })

      // ─────────── FULFILLED ───────────
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload?.data;
        state.isFetched = true;
      })

      // ─────────── REJECTED ───────────
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      })

       //UPDATE PROFILE
        // ─────────── PENDING ───────────
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isFetched = false;
      })

      // ─────────── FULFILLED ───────────
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
        state.isFetched = true;
      })

      // ─────────── REJECTED ───────────
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      });
  }
});

export const { clearProfileState , saveProfileData } = profileSlice.actions;
export default profileSlice.reducer;


//SAMPLE DATA
// {
//     "success": true,
//     "data": {
//         "id": 18,
//         "mobileNumber": "7397014106",
//         "fullName": "Balamurugan",
//         "email": "balaitsme23@gmail.com",
//         "googleAccount": false,
//         "roleId": 3,
//         "roleName": "User",
//         "isActive": true,
//         "createdAt": "2025-12-02T17:03:47.423774"
//     }
// }



//UPDATE PROFILE RESPONSE
// {
//     "success": true,
//     "message": "Profile updated successfully",
//     "user": {
//         "id": 18,
//         "mobileNumber": "7397014106",
//         "fullName": "balamurugan",
//         "email": "bala@gmail.com",
//         "googleAccount": false,
//         "roleId": 3,
//         "isActive": true,
//         "createdAt": "2025-12-02T17:03:47.423774"
//     }
// }