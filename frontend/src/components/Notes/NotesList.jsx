import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadNotesThunk } from '../../store/notes';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';
import './NotesList.css';

function NotesList({ applicationId }) {
  const dispatch = useDispatch();

  const notesMap = useSelector(state => state.notes.notes || {});
  const notes = useMemo(() => {
    return Object.values(notesMap).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notesMap]);

  useEffect(() => {
    if (applicationId) {
      dispatch(loadNotesThunk(applicationId));
    }
  }, [dispatch, applicationId]);

  return (
    <div className="notes-section">
      <h2>Notes</h2>
      <div className="notes-list">
        {notes.length === 0 && <p>No notes yet. Add one below!</p>}
        {notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
      <NoteForm applicationId={applicationId} />
    </div>
  );
}

export default NotesList;



