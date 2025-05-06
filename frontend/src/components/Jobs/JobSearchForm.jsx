import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchJobsThunk, clearJobsError} from "../../store/jobs";
import "./JobSearchForm.css";

function JobSearchForm() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("remote");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    dispatch(clearJobsError());
    dispatch(fetchJobsThunk({ query, location }));
  };
  return (
    <form onSubmit={handleSubmit} className="job-search-form">
      <input
        type="text"
        placeholder="Job title (e.g. Frontend Developer)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location (e.g. Remote, New York)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="submit" disabled={query.length < 3}>
        Search Jobs
      </button>
    </form>
  );
}

export default JobSearchForm;
