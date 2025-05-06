import JobSearchForm from './JobSearchForm';
import JobResultsList from './JobResultsList';
import './JobSearchPage.css'; 

function JobSearchPage() {
  return (
    <div className="job-search-page">
      <div className="job-search-left">
        <h2 className="job-page-title">Find a Job in Tech</h2>
        <p className="job-page-subtitle">Anywhere in the US and remote!</p>
        <JobSearchForm />
      </div>

      <div className="job-search-right">
        <JobResultsList />
      </div>
    </div>
  );
}


export default JobSearchPage;