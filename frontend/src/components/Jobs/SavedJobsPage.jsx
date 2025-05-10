import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSavedJobs, unsaveJobThunk } from "../../store/jobs";
import "./SavedJobsPage.css";

function SavedJobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const savedMap = useSelector((state) => state.jobs.saved || {});
  const savedJobs = Object.values(savedMap);

  useEffect(() => {
    dispatch(fetchSavedJobs());
  }, [dispatch]);

  const formatDate = (iso) => {
    const date = new Date(iso);
    if (isNaN(date)) return "Date Unknown";

    const diff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="saved-jobs-wrapper">
      <div className="saved-jobs-box">
        <h2>Saved Jobs</h2>
        <div className="saved-jobs-list">
          {savedJobs.length === 0 ? (
            <p>No saved jobs yet.</p>
          ) : (
            savedJobs.map((job) => (
              <div className="saved-job-card" key={job.id}>
                <div className="saved-job-info">
                  <div className="saved-job-title">{job.title}</div>
                  <div className="saved-job-company">{job.company}</div>
                  <div className="saved-job-date">{formatDate(job.savedAt)}</div>
                </div>
                <div className="saved-job-actions">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!savedMap[job.jobId]}
                      onChange={() => {
                        if (window.confirm("Unsave this job?")) {
                          dispatch(unsaveJobThunk({ id: job.id, jobId: job.jobId }));
                        }
                      }}
                    />
                    Unsave
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
        <button className="back-button" onClick={() => navigate("/jobs")}>
          Back to Job Search
        </button>
      </div>
    </div>
  );
}

export default SavedJobsPage;

