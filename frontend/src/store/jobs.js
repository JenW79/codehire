import { csrfFetch } from './csrf';

// ACTION TYPES
const LOAD_JOBS = 'jobs/LOAD_JOBS';
const CLEAR_JOBS = 'jobs/CLEAR_JOBS';
const JOBS_ERROR = 'jobs/JOBS_ERROR';

// ACTION CREATORS
export const loadJobs = (data) => ({
    type: LOAD_JOBS,
    listings: data.results,
    source: data.source
  });

export const clearJobs = () => ({
    type: CLEAR_JOBS
  });

export const jobsError = (error) => ({
    type: JOBS_ERROR,
    error
  });

// THUNKS
export const fetchJobsThunk = ({ query, location = 'remote' }) => async (dispatch) => {
    try {
      const params = new URLSearchParams({ query, location });
      const res = await csrfFetch(`/api/jobs/search?${params}`);
      if (!res.ok) throw new Error("Failed to fetch job listings");
      const data = await res.json();
      dispatch(loadJobs(data));
    } catch (err) {
      dispatch(jobsError(err.message));
    }
  };
  
  //INITIAL STATE
const initialState = {
    listings: [],
    source: null,
    error: null
  };

// REDUCER
export default function jobsReducer(state = initialState, action) {
    switch (action.type) {
      case LOAD_JOBS:
        return {
          ...state,
          listings: action.listings,
          source: action.source,
          error: null
        };
      case CLEAR_JOBS:
        return {
          ...state,
          listings: [],
          source: null,
          error: null
        };
      case JOBS_ERROR:
        return {
          ...state,
          error: action.error
        };
      default:
        return state;
    }
  }