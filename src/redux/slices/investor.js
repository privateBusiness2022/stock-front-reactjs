import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

const initialState = {
  investors: [],
};

const slice = createSlice({
  name: 'investors',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // GET USERS
    getAll(state, action) {
      state.isLoading = false;
      state.investors = action.payload;
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
      const response = await axios.get('/clients');
      dispatch(slice.actions.getAll(response.data));
    } catch (error) {
      dispatch(slice.actions.getAll([]));
    }
  };
}

// ----------------------------------------------------------------------
