import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

const initialState = {
  projects: [],
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // GET USERS
    getAll(state, action) {
      state.isLoading = false;
      state.projects = action.payload;
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
      const response = await axios.get('/projects');
      dispatch(slice.actions.getAll(response.data));
    } catch (error) {
      dispatch(slice.actions.getAll([]));
    }
  };
}

export function create(period) {
  return async () => {
    try {
      const response = await axios.post('/projects', period);
      dispatch(slice.actions.getAll([...slice.actions.projects, response.data]));
      // return response.status;
    } catch (error) {
      console.log(error);
    }
  };
}

// ----------------------------------------------------------------------
