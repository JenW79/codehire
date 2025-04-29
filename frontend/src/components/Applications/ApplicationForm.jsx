import { useState } from 'react';
import './ApplicationForm.css'; 


function ApplicationForm({ application, onSubmit }) {
  const [companyName, setCompanyName] = useState(application?.companyName || '');
  const [positionTitle, setPositionTitle] = useState(application?.positionTitle || '');
  const [status, setStatus] = useState(application?.status || 'Pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ companyName, positionTitle, status });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Company Name"
        required
      />
      <input
        type="text"
        value={positionTitle}
        onChange={(e) => setPositionTitle(e.target.value)}
        placeholder="Position Title"
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Withdrawn">Withdrawn</option> 
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ApplicationForm;