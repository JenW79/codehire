import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateResume } from "../../store/resumes";
import { useModal } from "../../context/Modal";
import "./EditResumeModal.css";

export default function EditResumeModal({ resume }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const parseMarkdown = (content) => {
    const lines = content.split("\n");
    const data = {
      name: "",
      jobTitle: "",
      education: "",
      skills: "",
      summary: "",
      experience: [],
    };
    let currentField = "";
    for (let line of lines) {
      if (line.startsWith("Name:")) data.name = line.replace("Name:", "").trim();
      else if (line.startsWith("Job Title:")) data.jobTitle = line.replace("Job Title:", "").trim();
      else if (line.startsWith("Education:")) data.education = line.replace("Education:", "").trim();
      else if (line.startsWith("Skills:")) data.skills = line.replace("Skills:", "").trim();
      else if (line.startsWith("Summary:")) data.summary = line.replace("Summary:", "").trim();
      else if (line.startsWith("Experience:")) currentField = "experience";
      else if (line.startsWith("-") && currentField === "experience") {
        const match = line.match(/^- (.+) at (.+?): (.+)$/);
        if (match) {
          data.experience.push({
            title: match[1].trim(),
            company: match[2].trim(),
            description: match[3].trim(),
          });
        }
      }
    }
    while (data.experience.length < 3) {
      data.experience.push({ title: "", company: "", description: "" });
    }
    return data;
  };

  const generateMarkdownFromFields = (data) => {
    let md = `Name: ${data.name}\nJob Title: ${data.jobTitle}\nEducation: ${data.education}\nSkills: ${data.skills}\nSummary: ${data.summary}\n`;
    if (data.experience?.length) {
      md += `Experience:\n`;
      data.experience.forEach((job) => {
        if (job.title || job.company || job.description) {
          md += `- ${job.title} at ${job.company}: ${job.description}\n`;
        }
      });
    }
    return md;
  };

  const [formData, setFormData] = useState(parseMarkdown(resume.content));
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    const { name, jobTitle, skills, summary } = formData;
    if (!name.trim() || !jobTitle.trim() || !skills.trim() || !summary.trim()) {
      setError("Missing required fields.");
      return;
    }

    const content = generateMarkdownFromFields(formData);

    const res = await dispatch(updateResume(resume.id, {
      title: resume.title,
      content
    }));

    if (res.success) {
      closeModal();
    } else {
      setError(res.payload?.error || "Failed to update resume.");
    }
  };

  return (
    <div className="edit-resume-modal">
      <h2>Edit Resume</h2>
      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Job Title"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
        />
        <input
          type="text"
          placeholder="Education"
          value={formData.education}
          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
        />
        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
        />
        <textarea
          placeholder="Professional Summary"
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        />
        <h4>Experience (Optional)</h4>
        {formData.experience.map((exp, idx) => (
          <div key={`exp-${idx}`} className="experience-group">
            <input
              type="text"
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => {
                const updated = [...formData.experience];
                updated[idx].title = e.target.value;
                setFormData({ ...formData, experience: updated });
              }}
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
            />
            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => {
                const updated = [...formData.experience];
                updated[idx].description = e.target.value;
                setFormData({ ...formData, experience: updated });
              }}
            />
          </div>
        ))}
        {error && <p className="error-message">{error}</p>}
        <div className="edit-resume-buttons">
          <button type="submit">Save</button>
          <button type="button" className="cancel-button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
}