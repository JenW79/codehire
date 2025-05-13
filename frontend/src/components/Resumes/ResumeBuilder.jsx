import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResumes,
  generateResume,
  deleteResume,
} from "../../store/resumes";

import { useModal } from "../../context/Modal";
import EditResumeModal from "./EditResumeModal";

import ReactMarkdown from "react-markdown";
import { FaTrash, FaDownload, FaEdit } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import "./ResumeBuilder.css";

export default function ResumeBuilder() {
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const resumesObj = useSelector((state) => state.resumes.all);
  const resumes = Object.values(resumesObj);
  const [resumesUsed, setResumesUsed] = useState(0);
  const [maxResumes, setMaxResumes] = useState(3);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    education: "",
    skills: "",
    summary: "",
    experience: [
      { title: "", company: "", description: "" },
      { title: "", company: "", description: "" },
      { title: "", company: "", description: "" },
    ],
  });

  useEffect(() => {
    dispatch(fetchResumes()).then((data) => {
      if (data) {
        setResumesUsed(data.resumesUsed);
        setMaxResumes(data.maxResumes);
      }
    });
  }, [dispatch]);

  const isFormValid =
    formData.name.trim() &&
    formData.jobTitle.trim() &&
    formData.skills.trim() &&
    formData.summary.trim();

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    setMessage("");

    const res = await dispatch(generateResume(formData));

    if (!res.success) {
      setMessage(res.payload?.error || "Something went wrong");
      setLoading(false);
      return;
    }

    const data = res.payload;
    setResumesUsed(data.resumesUsed);
    setMaxResumes(data.maxResumes);

    setFormData({
      name: "",
      jobTitle: "",
      education: "",
      skills: "",
      summary: "",
      experience: [
        { title: "", company: "", description: "" },
        { title: "", company: "", description: "" },
        { title: "", company: "", description: "" },
      ],
    });

    setLoading(false);
  };

  const openEditModal = (resume) => {
    setModalContent(<EditResumeModal resume={resume} />);
  };

  const handleDelete = (id) => {
    dispatch(deleteResume(id));
  };

  const handleDownload = (resume) => {
    const original = document.getElementById(`resume-${resume.id}`);
    const clone = original.cloneNode(true);

    clone.style.backgroundColor = "#fff";
    clone.style.color = "#000";
    clone.style.padding = "1rem";

    clone.querySelectorAll("*").forEach((el) => {
      el.style.color = "#000";
      el.style.background = "#fff";
    });

    const opt = {
      margin: 0.5,
      filename: `${resume.title.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(clone).save();
  };

  return (
    <div className="resume-page">
      <div className={`resume-form ${loading ? "loading" : ""}`}>
        <h3>Resume Details</h3>

        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Job Title"
          value={formData.jobTitle}
          onChange={(e) =>
            setFormData({ ...formData, jobTitle: e.target.value })
          }
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Education"
          value={formData.education}
          onChange={(e) =>
            setFormData({ ...formData, education: e.target.value })
          }
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          disabled={loading}
        />

        <textarea
          placeholder="Professional Summary"
          value={formData.summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          disabled={loading}
        />

        <h4>Experience (Optional)</h4>
        {formData.experience.map((exp, idx) => (
          <div key={idx} className="experience-group">
            <input
              type="text"
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => {
                const updated = [...formData.experience];
                updated[idx].title = e.target.value;
                setFormData({ ...formData, experience: updated });
              }}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => {
                const updated = [...formData.experience];
                updated[idx].company = e.target.value;
                setFormData({ ...formData, experience: updated });
              }}
              disabled={loading}
            />
            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => {
                const updated = [...formData.experience];
                updated[idx].description = e.target.value;
                setFormData({ ...formData, experience: updated });
              }}
              disabled={loading}
            />
          </div>
        ))}

        <button
          onClick={handleGenerate}
          disabled={loading || !isFormValid || resumesUsed >= maxResumes}
        >
          {loading ? "Generating..." : "Generate Resume"}
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
              <div className="resume-card-header">
                <h4>{resume.title}</h4>
                <div className="resume-card-actions">
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(resume)}
                    title="Download Resume"
                  >
                    <FaDownload />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(resume.id)}
                    title="Delete Resume"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(resume)}
                    title="Edit Resume"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>

              <div id={`resume-${resume.id}`} className="resume-markdown">
                <ReactMarkdown>{resume.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
