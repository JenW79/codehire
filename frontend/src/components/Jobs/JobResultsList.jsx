import { useSelector } from "react-redux";
import "./JobResultsList.css";
import { Link } from "react-router-dom";

function JobResultsList() {
  const jobs = useSelector((state) => state.jobs.listings);
  const loading = useSelector((state) => state.jobs.loading);
  const error = useSelector((state) => state.jobs.error);
  const source = useSelector((state) => state.jobs.source);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!jobs.length)
    return (
      <p className="job-empty-message">No jobs found yet. Try a search!</p>
    );

  return (
    <div className="job-results-list">
      <h3>
        Showing {jobs.length} results from {source}
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
            <Link to={`/jobs/${job.id}`} className="job-details-link">
              Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobResultsList;
