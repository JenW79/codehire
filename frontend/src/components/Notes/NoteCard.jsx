import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteNoteThunk, updateNoteThunk } from "../../store/notes";
import "./NoteCard.css";

function NoteCard({ note }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(note.content);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await dispatch(deleteNoteThunk(note.id));
    }
  };

  const handleSave = async () => {
    try {
      if (content.trim() === "") return;
      await dispatch(updateNoteThunk(note.id, { content }));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };
  return (
    <div className="note-card">
      <p className="note-label">
        <strong>Note:</strong>
      </p>

      {editing ? (
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="note-textarea"
          />
          <div className="note-actions">
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => {
                setContent(note.content);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
      <div className="note-content">
  <p>{note.content}</p>
  <div className="note-footer">
    <div className="note-actions">
      <button onClick={() => setEditing(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
    <p className="note-date">
      {new Date(note.createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </p>
  </div>
</div>
      )}
    </div>
  );
}

export default NoteCard;
