import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadApplicationsThunk } from "../../store/applications";
import { Link } from "react-router-dom";
import ApplicationCard from "./ApplicationCard";
import ApplicationFormWrapper from "./ApplicationFormWrapper";
import "./ApplicationsList.css";

function ApplicationsList() {
  const dispatch = useDispatch();
  const applications = useSelector(
    (state) => state.applications.allApplications
  );

  useEffect(() => {
    dispatch(loadApplicationsThunk());
  }, [dispatch]);

  if (!applications) return <p>Loading applications...</p>;

  return (
    <div className="applications-page">
      <div className="application-form-wrapper">
        <h2>Add Application</h2>
        <ApplicationFormWrapper />
      </div>

      <div className="applications-list">
        <h1>Application Tracker</h1>

        <div className="application-headers">
          <div>Position</div>
          <div>Company</div>
          <div>Status</div>
          <div>Notes</div>
          <div>Time</div>
        </div>

        <div className="applications-container">
          {Object.values(applications).length === 0 ? (
            <p className="empty-app-message">
              No applications yet — go ahead and create your first one! 
            </p>
          ) : (
            Object.values(applications).map((app) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="application-link"
              >
                <ApplicationCard application={app} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationsList;
