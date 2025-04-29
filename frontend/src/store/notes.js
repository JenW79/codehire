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

  export const updateNoteThunk = (applicationId, noteId, noteData) => async (dispatch) => {
    const res = await csrfFetch(`/api/applications/${applicationId}/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
    if (res.ok) {
      const note = await res.json();
      dispatch(updateNote(note));
      return note;
    }
  }

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
    notes: {},
};

// Reducer
export default function notesReducer(state = initialState, action) {
    switch (action.type) {
      case LOAD_NOTES: {
        const newState = { notes: {} };
        if (Array.isArray(action.notes)) {
          action.notes.forEach(note => {
            newState.notes[note.id] = note;
          });
        }
        return newState;
      }      
      case ADD_NOTE:
        return {
          ...state,
          notes: { ...state.notes, [action.note.id]: action.note },
        };
      case UPDATE_NOTE:
        return {
          ...state,
          notes: { ...state.notes, [action.note.id]: action.note },
        };
      case DELETE_NOTE: {
        const newState = { ...state, notes: { ...state.notes } };
        delete newState.notes[action.noteId];
        return newState;
      }
      default:
        return state;
    }
  }
  