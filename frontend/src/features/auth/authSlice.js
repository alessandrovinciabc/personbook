import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAccount = createAsyncThunk('auth/fetchAccount', async () => {
  const response = await axios.get('/api/account');
  return response.data.user;
});

const initialState = {
  status: 'idle', // idle | pending | fulfilled | rejected
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAccount.pending]: (state, action) => {
      state.status = 'pending';
    },
    [fetchAccount.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.status = 'fulfilled';
    },
    [fetchAccount.rejected]: (state, action) => {
      state.status = 'rejected';
    },
  },
});

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectStatus = (state) => state.auth.status;
