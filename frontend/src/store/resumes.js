import { csrfFetch } from "./csrf";

// ACTION TYPES
const LOAD_RESUMES = "resumes/LOAD_RESUMES";
const ADD_RESUME = "resumes/ADD_RESUME";
const REMOVE_RESUME = "resumes/REMOVE_RESUME";
const UPDATE_RESUME = "resumes/UPDATE_RESUME";

// ACTION CREATORS
export const loadResumes = (resumes) => ({
  type: LOAD_RESUMES,
  resumes,
});

export const addResume = (resume) => ({
  type: ADD_RESUME,
  resume,
});

export const setUpdatedResume = (resume) => ({
  type: UPDATE_RESUME,
  resume,
});

export const removeResume = (id) => ({
  type: REMOVE_RESUME,
  id,
});

// THUNKS
export const fetchResumes = () => async (dispatch) => {
  const res = await csrfFetch("/api/resumes");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadResumes(data.resumes));
    return {
      resumesUsed: data.resumesUsed,
      maxResumes: data.maxResumes,
    };
  }
};

export const generateResume = (formData) => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/resumes/generate", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw res;

    const data = await res.json();
    dispatch(addResume(data.newResume));
    return { success: true, payload: data };
  } catch (err) {
    const error = await err.json?.();
    return { success: false, payload: error };
  }
};

export const updateResume = (id, data) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw res;

    const updated = await res.json();
    dispatch(setUpdatedResume(updated)); 
    return { success: true };
  } catch (err) {
    const error = await err.json?.();
    return { success: false, payload: error };
  }
};


export const deleteResume = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/resumes/${id}`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(removeResume(id));
  }
};

// INITIAL STATE
const initialState = {
  all: {},
};

// REDUCER
export default function resumesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_RESUMES: {
      const newState = { all: {} };
      action.resumes.forEach((resume) => {
        newState.all[resume.id] = resume;
      });
      return newState;
    }
    case ADD_RESUME: {
      return {
        ...state,
        all: {
          ...state.all,
          [action.resume.id]: action.resume,
        },
      };
    }
    case UPDATE_RESUME: {
      return {
        ...state,
        all: {
          ...state.all,
          [action.resume.id]: action.resume,
        },
      };
    }
    case REMOVE_RESUME: {
      const newState = {
        ...state,
        all: { ...state.all },
      };
      delete newState.all[action.id];
      return newState;
    }
    default:
      return state;
  }
}
