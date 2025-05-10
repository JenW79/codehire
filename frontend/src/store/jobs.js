import { csrfFetch } from "./csrf";

// ACTION TYPES
const LOAD_JOBS = "jobs/LOAD_JOBS";
const CLEAR_JOBS = "jobs/CLEAR_JOBS";
const JOBS_ERROR = "jobs/JOBS_ERROR";
const CLEAR_JOBS_ERROR = "jobs/CLEAR_JOBS_ERROR";
const LOAD_SAVED_JOBS = "jobs/LOAD_SAVED_JOBS";
const ADD_SAVED_JOB = "jobs/ADD_SAVED_JOB";
const REMOVE_SAVED_JOB = "jobs/REMOVE_SAVED_JOB";

// ACTION CREATORS
export const loadJobs = (data) => ({
  type: LOAD_JOBS,
  listings: data.results,
  source: data.source,
});

export const clearJobs = () => ({
  type: CLEAR_JOBS,
});

export const jobsError = (error) => ({
  type: JOBS_ERROR,
  error,
});

export const clearJobsError = () => ({
  type: CLEAR_JOBS_ERROR,
});

export const loadSavedJobs = (jobs) => ({
  type: LOAD_SAVED_JOBS,
  jobs,
});
export const addSavedJob = (job) => ({
  type: ADD_SAVED_JOB,
  job,
});
export const removeSavedJob = (id) => ({
  type: REMOVE_SAVED_JOB,
  id,
});


// THUNKS
export const fetchJobsThunk =
  ({ query, location = "remote" }) =>
  async (dispatch) => {
    dispatch(clearJobsError());
    try {
      const params = new URLSearchParams({ query, location });
      const res = await csrfFetch(`/api/jobs/search?${params}`);

      if (res.status === 404) {
        const data = await res.json();
        dispatch(jobsError(data.error || "No jobs found for that search."));
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch job listings.");

      const data = await res.json();
      dispatch(loadJobs(data));
    } catch (err) {
      dispatch(jobsError(err.message || "Something went wrong."));
    }
  };


  export const fetchSavedJobs = () => async (dispatch) => {
    const res = await csrfFetch('/api/saved-jobs');
    if (res.ok) {
      const data = await res.json();
      dispatch(loadSavedJobs(data));
    }
  };
  
  export const saveJobThunk = (job) => async (dispatch) => {
    const res = await csrfFetch('/api/saved-jobs', {
      method: 'POST',
    body: JSON.stringify({
      jobId: job.id,        
      source: job.source,
      title: job.title,
      company: job.company,
      location: job.location,
      applyUrl: job.applyUrl,
    }),

    });
  
    if (res.ok) {
      const data = await res.json();
      dispatch(addSavedJob(data));
    } else {
      const error = await res.json();
      console.error("Save failed:", error);
    }
  };
  
  export const unsaveJobThunk = ({ id, jobId }) => async (dispatch) => {
  const res = await csrfFetch(`/api/saved-jobs/${id}`, {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(removeSavedJob(jobId)); 
  }
};

//INITIAL STATE
const initialState = {
  listings: [],
  saved: {},
  source: null,
  error: null,
};

// REDUCER
export default function jobsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_JOBS:
      return {
        ...state,
        listings: action.listings,
        source: action.source,
        error: null,
      };
    case CLEAR_JOBS:
      return {
        ...state,
        listings: [],
        source: null,
        error: null,
      };
    case JOBS_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case CLEAR_JOBS_ERROR:
      return {
        ...state,
        error: null,
      };
      
      //load saved jobs
      case LOAD_SAVED_JOBS: {
        const newSaved = {};
        action.jobs.forEach(job => {
          newSaved[job.jobId] = job; // use jobId from API
        });
        return {
          ...state,
          saved: newSaved,
        };
      }
      
      case ADD_SAVED_JOB:
        return {
          ...state,
          saved: {
            ...state.saved,
            [action.job.jobId]: action.job,
          },
        };
      
      case REMOVE_SAVED_JOB: {
        const newSaved = { ...state.saved };
        delete newSaved[action.id];
        return {
          ...state,
          saved: newSaved,
        };
      }
    default:
      return state;
  }
}
