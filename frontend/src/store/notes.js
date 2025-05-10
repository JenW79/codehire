import { csrfFetch } from './csrf';

// Action Types
const LOAD_NOTES = 'notes/LOAD_NOTES';
const ADD_NOTE = 'notes/ADD_NOTE';
const UPDATE_NOTE = 'notes/UPDATE_NOTE';
const DELETE_NOTE = 'notes/DELETE_NOTE';

// Action Creators
const loadNotes = (notes) => ({type: LOAD_NOTES, notes});
const addNote = (note) => ({type: ADD_NOTE, note});
const updateNote = (note) => ({type: UPDATE_NOTE, note});
const deleteNote = (noteId) => ({type: DELETE_NOTE, noteId});

// Thunks

export const loadNotesThunk = (applicationId) => async (dispatch) => {
    const res = await csrfFetch(`/api/applications/${applicationId}/notes`);
    if (res.ok) {
      const data = await res.json();
      dispatch(loadNotes(data.notes));
    }
  };

  export const addNoteThunk = (applicationId, noteData) => async (dispatch) => {
    const res = await csrfFetch(`/api/applications/${applicationId}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
    if (res.ok) {
      const note = await res.json();
      dispatch(addNote(note));
      return note;
    }
  }

  export const updateNoteThunk = (noteId, noteData) => async (dispatch) => {
  const res = await csrfFetch(`/api/notes/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify(noteData),
  });

  if (res.ok) {
    const note = await res.json();
    dispatch(updateNote(note));
    return note;
  }
};

  export const deleteNoteThunk = (noteId) => async (dispatch) => {
    const res = await csrfFetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      dispatch(deleteNote(noteId));
    }
  };

// Initial State
const initialState = {
    notesByApplication: {},
};

// Reducer
export default function notesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_NOTES: {
      const notesById = {};
      action.notes.forEach(note => {
        notesById[note.id] = note;
      });

      return {
        ...state,
        notesByApplication: {
          ...state.notesByApplication,
          [action.notes[0]?.applicationId]: notesById, 
        }
      };
    }

    case ADD_NOTE: {
      const appId = action.note.applicationId;
      return {
        ...state,
        notesByApplication: {
          ...state.notesByApplication,
          [appId]: {
            ...(state.notesByApplication[appId] || {}),
            [action.note.id]: action.note
          }
        }
      };
    }

    case UPDATE_NOTE: {
      const appId = action.note.applicationId;
      return {
        ...state,
        notesByApplication: {
          ...state.notesByApplication,
          [appId]: {
            ...(state.notesByApplication[appId] || {}),
            [action.note.id]: action.note
          }
        }
      };
    }

    case DELETE_NOTE: {
      const newState = { ...state.notesByApplication };
      for (const appId in newState) {
        if (newState[appId][action.noteId]) {
          delete newState[appId][action.noteId];
          break;
        }
      }
      return { ...state, notesByApplication: newState };
    }

    default:
      return state;
  }
}