import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

const initialState = {
  users: [],
};

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // GET USERS
    getAll(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAll() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/users?skip=0&take=10000');
      dispatch(slice.actions.getAll(response.data));
    } catch (error) {
      dispatch(slice.actions.getAll([]));
    }
  };
}

export function create(user) {
  return async () => {
    try {
      const response = await axios.post('/users', user);
      dispatch(slice.actions.getAll([...slice.actions.users, response.data]));
      // return response.status;
    } catch (error) {
      console.log(error);
    }
  };
}

// ----------------------------------------------------------------------
