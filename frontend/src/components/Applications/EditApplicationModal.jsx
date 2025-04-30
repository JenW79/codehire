import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { editApplicationThunk, deleteApplicationThunk, loadSingleApplicationThunk } from '../../store/applications';
import './EditApplicationModal.css';


function EditApplicationModal({ application, onClose }) {
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState(application.companyName);
    const [positionTitle, setPositionTitle] = useState(application.positionTitle);
    const [status, setStatus] = useState(application.status);

    const navigate = useNavigate();
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      await dispatch(editApplicationThunk(application.id, { companyName, positionTitle, status }));
      await dispatch(loadSingleApplicationThunk(application.id))
      onClose();
    };
  
    const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this application?')) {
        await dispatch(deleteApplicationThunk(application.id));
        navigate('/applications');
      }
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Edit Application</h2>
          <form onSubmit={handleUpdate}>
            <label>
              Company:
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </label>
            <label>
              Position Title:
              <input
                type="text"
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                required
              />
            </label>
            <label>
              Status:
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleDelete} className="delete-button">Delete Application</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default EditApplicationModal;