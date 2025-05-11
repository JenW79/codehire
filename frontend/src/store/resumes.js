import { csrfFetch } from "./csrf";

// ACTION TYPES
const LOAD_RESUMES = "resumes/LOAD_RESUMES";
const ADD_RESUME = "resumes/ADD_RESUME";
const REMOVE_RESUME = "resumes/REMOVE_RESUME";

// ACTION CREATORS
export const loadResumes = (resumes) => ({
  type: LOAD_RESUMES,
  resumes,
});

export const addResume = (resume) => ({
  type: ADD_RESUME,
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

export const generateResume = ({ summary, title }) => async (dispatch) => {
  const res = await csrfFetch("/api/resumes/generate", {
    method: "POST",
    body: JSON.stringify({ summary, title }),
  });

  const data = await res.json();

  if (res.ok) {
    dispatch(addResume(data.newResume)); 
    return data; 
  } else {
    return data; 
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
