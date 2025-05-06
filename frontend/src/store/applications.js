import { csrfFetch } from './csrf';

// ACTION TYPES
const LOAD_APPLICATIONS = 'applications/LOAD_APPLICATIONS';
const LOAD_SINGLE_APPLICATION = 'applications/LOAD_SINGLE_APPLICATION';
const ADD_APPLICATION = 'applications/ADD_APPLICATION';
const EDIT_APPLICATION = 'applications/EDIT_APPLICATION';
const DELETE_APPLICATION = 'applications/DELETE_APPLICATION';

// ACTION CREATORS
const loadApplications = (applications) => ({
    type: LOAD_APPLICATIONS,
    applications
  });
  
  const loadSingleApplication = (application) => ({
    type: LOAD_SINGLE_APPLICATION,
    application
  });
  
  const addApplication = (application) => ({
    type: ADD_APPLICATION,
    application
  });
  
  const editApplication = (application) => ({
    type: EDIT_APPLICATION,
    application
  });
  
  const deleteApplication = (applicationId) => ({
    type: DELETE_APPLICATION,
    applicationId
  });

  
  // THUNKS
export const loadApplicationsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/applications');
    if (res.ok) {
      const data = await res.json();
      dispatch(loadApplications(data.applications));
    }
  };
  
  export const loadSingleApplicationThunk = (applicationId) => async (dispatch) => {
    try {
      const res = await csrfFetch(`/api/applications/${applicationId}`);
      if (!res.ok) throw new Error("Application not found");
  
      const data = await res.json();
      dispatch(loadSingleApplication(data.application));
    } catch (err) {
      dispatch(loadSingleApplication(null)); 
    }
  };
  
  export const addApplicationThunk = (applicationData) => async (dispatch) => {
    const res = await csrfFetch('/api/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
    if (res.ok) {
      const data = await res.json();
      await dispatch(loadApplicationsThunk());
      return data;
    }
  };
  
  export const editApplicationThunk = (applicationId, applicationData) => async (dispatch) => {
    const res = await csrfFetch(`/api/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData)
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(editApplication(data));
      return data;
    }
  };
  
  export const deleteApplicationThunk = (applicationId) => async (dispatch) => {
    const res = await csrfFetch(`/api/applications/${applicationId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      dispatch(deleteApplication(applicationId));
    }
  };
  
  // INITIAL STATE
  const initialState = {
    allApplications: {},
    singleApplication: null
  };
  
  // REDUCER
  export default function applicationsReducer(state = initialState, action) {
    switch (action.type) {
      case LOAD_APPLICATIONS: {
        const newState = { ...state, allApplications: {} };
        action.applications.forEach(app => {
          newState.allApplications[app.id] = app;
        });
        return newState;
      }
      case LOAD_SINGLE_APPLICATION: {
        return { ...state, singleApplication: action.application };
      }
      case ADD_APPLICATION: {
        return {
          ...state,
          allApplications: {
            ...state.allApplications,
            [action.application.id]: action.application
          }
        };
      }
      case EDIT_APPLICATION: {
        return {
          ...state,
          allApplications: {
            ...state.allApplications,
            [action.application.id]: action.application
          },
          singleApplication: action.application
        };
      }
      case DELETE_APPLICATION: {
        const newState = { ...state, allApplications: { ...state.allApplications } };
        delete newState.allApplications[action.applicationId];
        return newState;
      }
      default:
        return state;
    }
  }