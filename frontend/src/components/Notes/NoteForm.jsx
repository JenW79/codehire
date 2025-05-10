import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNoteThunk } from "../../store/notes";
import './NoteForm.css';

function NoteForm({ applicationId }) {
    const dispatch = useDispatch();
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (content.trim() === "") return;
      
      await dispatch(addNoteThunk(applicationId, { content }));
      setContent(""); 
    };
    
    return(
        <form onSubmit={handleSubmit} className="note-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a new note..."
          className="note-form-textarea"
        />
        <button type="submit">Add Note</button>
      </form>
    )
}
export default NoteForm;