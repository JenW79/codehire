import { useState } from "react";
import { useSelector } from "react-redux";
import JobDetailModal from "./JobDetailModal";
import "./JobResultsList.css";

function JobResultsList() {
  const jobs = useSelector((state) => state.jobs.listings);
  const loading = useSelector((state) => state.jobs.loading);
  const error = useSelector((state) => state.jobs.error);
  const source = useSelector((state) => state.jobs.source);
  const [selectedJob, setSelectedJob] = useState(null);

  if (loading) return <p className="job-empty-message">Loading jobs...</p>;
  if (error) return <p className="job-empty-message">Error: {error}</p>;
  if (!jobs.length)
    return (
      <p className="job-empty-message">No jobs found yet. Try a search!</p>
    );

  return (
    <div className="job-results-list">
      <h3>
        Showing {jobs.length} results
      </h3>
      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <h4>{job.title}</h4>
          <p>
            {job.company} — {job.location}
          </p>
          <small>
            {job.datePosted
              ? new Date(job.datePosted).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Date Unknown"}
          </small>
          <div>
            <button
              type="button"
              onClick={() => setSelectedJob(job)}
              className="job-details-link"
            >
              Details
            </button>
          </div>
        </div>
      ))}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

export default JobResultsList;
