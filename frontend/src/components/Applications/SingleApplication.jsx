import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadSingleApplicationThunk,
  deleteApplicationThunk,
} from "../../store/applications";
import EditApplicationModal from "./EditApplicationModal";
import { useParams, useNavigate } from "react-router-dom";
import NotesList from "../Notes/NotesList";
import "./SingleApplication.css"; 

function SingleApplication() {
  const { applicationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const application = useSelector(
    (state) => state.applications.singleApplication
  );

  useEffect(() => {
    dispatch(loadSingleApplicationThunk(applicationId));
  }, [dispatch, applicationId]);

  // const handleDelete = async () => {
  //   if (window.confirm("Are you sure you want to delete this application?")) {
  //     await dispatch(deleteApplicationThunk(applicationId));
  //     navigate("/applications");
  //   }
  // };

  if (application === null) {
    return <p className="error-message">Application not found.</p>;
  }
  
  if (!application || !application.id) {
    return <p>Loading application...</p>;
  }

  return (
    <div className="single-application-wrapper">
      <div className="application-card">
        <h2>{application.positionTitle}</h2>
        <p><strong>Company:</strong> {application.companyName}</p>
        <p><strong>Status:</strong> {application.status}</p>

        <div className="application-controls">
          <button onClick={() => setShowEditModal(true)}>Edit</button>
          <button className="back-btn" onClick={() => navigate("/applications")}>Back to Tracker</button>
        </div>
      </div>

      <NotesList applicationId={application.id} />

      {showEditModal && (
        <EditApplicationModal
          application={application}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

export default SingleApplication;

