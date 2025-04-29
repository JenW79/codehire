import './ApplicationCard.css';


function ApplicationCard({ application }) {
  
  if (!application || !application.positionTitle || !application.status) {
    return <div className="application-card">Incomplete application data</div>;
  }

  return (
    <div className="application-card">
      <div className="application-position">{application.positionTitle}</div>
      <div className="application-company">{application.companyName}</div>
      <div>
        <span className={`status-badge status-${application.status.toLowerCase()}`}>
          {application.status}
        </span>
      </div>
      <div className="application-notes">📝</div>
      <div className="application-time">Today</div> 
    </div>
  );
}

export default ApplicationCard;