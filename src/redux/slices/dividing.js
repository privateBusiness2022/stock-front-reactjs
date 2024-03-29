import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

const initialState = {
  stages: [],
  numbers: {},
  coUsers: [],
  commissions: [],
};

const slice = createSlice({
  name: 'stages',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // GET USERS
    getAll(state, action) {
      state.isLoading = false;
      state.stages = action.payload;
    },

    // GET NUMBERS
    getNumbers(state, action) {
      state.isLoading = false;
      state.numbers = action.payload;
    },

    // GET USERS
    getUsers(state, action) {
      state.isLoading = false;
      state.coUsers = action.payload;
    },

    getCommissions(state, action) {
      state.isLoading = false;
      state.commissions = action.payload;
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
      const response = await axios.get('/periods/stages');
      dispatch(slice.actions.getAll(response.data));
    } catch (error) {
      dispatch(slice.actions.getAll([]));
    }
  };
}

export function getById(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/periods/stages/${id}`);
      dispatch(slice.actions.getAll(response.data));
    } catch (error) {
      dispatch(slice.actions.getAll([]));
    }
  };
}

export function getCommissions(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/periods/${id}/commissions`);
      dispatch(slice.actions.getCommissions(response.data));
    } catch (error) {
      dispatch(slice.actions.getCommissions([]));
    }
  };
}

export function getNumber() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/periods/numbers');
      console.log(response.data);
      dispatch(slice.actions.getNumbers(response.data));
    } catch (error) {
      dispatch(slice.actions.getNumbers({}));
    }
  };
}

export function getUsers(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/periods/${id}/usersBeneficiary`);
      dispatch(slice.actions.getUsers(response.data));
    } catch (error) {
      dispatch(slice.actions.getUsers([]));
    }
  };
}
// ----------------------------------------------------------------------
