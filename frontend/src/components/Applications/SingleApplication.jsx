import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSingleApplicationThunk, deleteApplicationThunk } from '../../store/applications';
import { useParams, useNavigate } from 'react-router-dom';

function SingleApplication() {
  const { applicationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const application = useSelector(state => state.applications.singleApplication);

  useEffect(() => {
    dispatch(loadSingleApplicationThunk(applicationId));
  }, [dispatch, applicationId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await dispatch(deleteApplicationThunk(applicationId));
      navigate('/applications');
    }
  };

  if (!application) return <p>Loading application...</p>;

  return (
    <div className="single-application">
      <h1>{application.positionTitle}</h1>
      <p><strong>Company:</strong> {application.companyName}</p>
      <p><strong>Status:</strong> {application.status}</p>
      <button onClick={handleDelete}>Delete Application</button>
      {/* Later: Notes will be added down here! */}
    </div>
  );
}

export default SingleApplication;