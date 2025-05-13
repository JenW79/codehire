import { useDispatch, useSelector } from "react-redux";
import { saveJobThunk, unsaveJobThunk, fetchSavedJobs } from "../../store/jobs";
import { useEffect } from "react";

import "./JobDetailModal.css";

function JobDetailModal({ job, onClose }) {
  const dispatch = useDispatch();
  const savedJobs = useSelector((state) => state.jobs.saved);
  const savedRecord = job && (savedJobs[job.jobId] || savedJobs[job.id]);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, []);

  const handleToggleSave = () => {
    if (savedRecord && savedRecord.id) {
      dispatch(unsaveJobThunk(savedRecord.id));
    } else {
      console.warn(" Can't unsave: No saved record found for job", job);
    }
  };
  if (job === null) {
    return (
      <div className="job-modal-overlay" onClick={onClose}>
        <div className="job-modal" onClick={(e) => e.stopPropagation()}>
          <h3>Job not found.</h3>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  if (!job) return null;
  const plainDescription = job.description
    ? job.description
        .replace(/<\/(div|p|h\d|li|ul|br)>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .trim()
    : "This job's full description is available on the Apply page. Click below to learn more.";
  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Job Details</h2>
        <div className="job-detail-header">
          <h3>{job.title}</h3>
          <span>
            {job.datePosted
              ? new Date(job.datePosted).toLocaleDateString()
              : "Date Unknown"}
          </span>
        </div>
        <p>
          <strong>Company:</strong> {job.company}
        </p>
        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Description:</strong>
        </p>
        <pre className="job-description">{plainDescription}</pre>
        <div className="job-detail-actions">
          <a href={job.applyUrl} target="_blank" rel="noreferrer">
            Apply
          </a>
          {!savedRecord && (
            <button onClick={() => dispatch(saveJobThunk(job))}>
              Save Job
            </button>
          )}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailModal;
