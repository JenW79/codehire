import './JobDetailModal.css';

function JobDetailModal({ job, onClose }) {
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

    return (
        <div className="job-modal-overlay" onClick={onClose}>
          <div className="job-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Job Details</h2>
            <div className="job-detail-header">
              <h3>{job.title}</h3>
              <span>{new Date(job.datePosted).toLocaleDateString()}</span>
            </div>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Description:</strong></p>
            <p>{job.description}</p>
            <div className="job-detail-actions">
              <a href={job.applyUrl} target="_blank" rel="noreferrer">Apply</a>
              <button onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      );
    }
    
    export default JobDetailModal;