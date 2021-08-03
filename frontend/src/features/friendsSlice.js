import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async (userId) => {
    const response = await axios.get(`/api/user/${userId}/friends`);
    return response.data;
  }
);

const initialState = {
  status: 'idle', // idle | pending | fulfilled | rejected
  error: null,
  friends: [],
  youRequested: [],
  theyRequested: [],
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchFriends.pending]: (state, action) => {
      state.status = 'pending';
    },
    [fetchFriends.fulfilled]: (state, action) => {
      state.friends = action.payload.friends;
      state.youRequested = action.payload.youRequested;
      state.theyRequested = action.payload.theyRequested;
      state.status = 'fulfilled';
    },
    [fetchFriends.rejected]: (state, action) => {
      state.status = 'rejected';
    },
  },
});

export default friendsSlice.reducer;

export const selectRelationships = (state) => ({
  friends: state.friends.friends,
  youRequested: state.friends.youRequested,
  theyRequested: state.friends.theyRequested,
});
export const selectFriendsStatus = (state) => state.friends.status;
