import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

const initialState = {
  requests: {
    requestsToChange: [],
    requestsToWithdrawal: [],
  },
};

const slice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // GET USERS
    setRequestsToChange(state, action) {
      state.isLoading = false;
      state.requests.requestsToChange = action.payload;
    },
    setRequestsToWithdrawal(state, action) {
      state.isLoading = false;
      state.requests.requestsToWithdrawal = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getRequestsToChange() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/clients/requests');
      dispatch(slice.actions.setRequestsToChange(response.data));
    } catch (error) {
      dispatch(slice.actions.setRequestsToChange([]));
    }
  };
}

export function getRequestsToWithdrawal() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/clients/requests-to-withdrawal');
      dispatch(slice.actions.setRequestsToWithdrawal(response.data));
    } catch (error) {
      dispatch(slice.actions.setRequestsToWithdrawal([]));
    }
  };
}

// ----------------------------------------------------------------------
