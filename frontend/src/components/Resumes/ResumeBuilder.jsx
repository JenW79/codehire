import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResumes,
  generateResume,
  deleteResume,
} from "../../store/resumes";
import ReactMarkdown from "react-markdown";
import { FaTrash } from "react-icons/fa";
import "./ResumeBuilder.css";

export default function ResumeBuilder() {
  const dispatch = useDispatch();
  const resumesObj = useSelector((state) => state.resumes.all);
  const resumes = Object.values(resumesObj);
  const [summary, setSummary] = useState("");
  const [resumesUsed, setResumesUsed] = useState(0);
  const [maxResumes, setMaxResumes] = useState(3);
  const [message, setMessage] = useState("");

 useEffect(() => {
  dispatch(fetchResumes()).then((data) => {
    if (data) {
      setResumesUsed(data.resumesUsed);
      setMaxResumes(data.maxResumes);
    }
  });
}, [dispatch]);

  const handleGenerate = async () => {
    const res = await dispatch(
      generateResume({ summary, title: "Generated Resume" })
    );
    const data = await res.payload;

    if (data.error) {
      setMessage(data.error);
      setResumesUsed(data.resumesUsed);
    } else {
      setResumesUsed(data.resumesUsed);
      setMaxResumes(data.maxResumes);
    }
    setSummary("");
  };

  const handleDelete = (id) => {
    dispatch(deleteResume(id));
  };

  return (
    <div className="resume-page">
      <div className="resume-form">
        <h3>Add Summary</h3>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Paste your summary..."
        />
        <button
          onClick={handleGenerate}
          disabled={!summary.trim() || resumesUsed >= maxResumes}
        >
          Generate Resume
        </button>

        {message && <p className="error-message">{message}</p>}
        <p>
          You’ve generated {resumesUsed} of {maxResumes} resumes today.
        </p>
      </div>

      <div className="resume-list">
        <h3>Saved Resumes</h3>
        {resumes.length === 0 ? (
          <p>No resumes yet.</p>
        ) : (
          resumes.map((resume) => (
            <div className="resume-card" key={resume.id}>
              <h4>{resume.title}</h4>
              <button
                onClick={() => handleDelete(resume.id)}
                title="Delete Resume"
              >
                <FaTrash />
              </button>
              <div className="resume-markdown">
                <ReactMarkdown>{resume.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
