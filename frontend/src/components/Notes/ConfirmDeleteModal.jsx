import { useDispatch } from 'react-redux';
import { deleteNoteThunk } from '../../store/notes';
import { useModal } from '../../context/Modal';
import './ConfirmDeleteModal.css';

export default function ConfirmDeleteNoteModal({ noteId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleConfirm = async () => {
    await dispatch(deleteNoteThunk(noteId));
    closeModal();
  };

  return (
    <div className="confirm-delete-modal">
      <h3>Confirm Deletion</h3>
      <p>Are you sure you want to delete this note?</p>
      <div className="modal-actions">
        <button onClick={handleConfirm} className="confirm-btn">Yes, Delete</button>
        <button onClick={closeModal} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
}