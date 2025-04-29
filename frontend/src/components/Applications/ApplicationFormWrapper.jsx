import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addApplicationThunk, editApplicationThunk, loadSingleApplicationThunk } from '../../store/applications';
import { useEffect } from 'react';
import ApplicationForm from './ApplicationForm';
import { useNavigate } from 'react-router-dom';

function ApplicationFormWrapper() {
  const { applicationId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const application = useSelector(state => state.applications.singleApplication);

  useEffect(() => {
    if (applicationId) {
      dispatch(loadSingleApplicationThunk(applicationId));
    }
  }, [dispatch, applicationId]);

  const handleSubmit = async (formData) => {
    if (applicationId) {
      await dispatch(editApplicationThunk(applicationId, formData));
    } else {
      await dispatch(addApplicationThunk(formData));
    }
    navigate('/applications');
  };

  if (applicationId && !application) return <p>Loading...</p>;

  return (
    <ApplicationForm application={application} onSubmit={handleSubmit} />
  );
}

export default ApplicationFormWrapper;