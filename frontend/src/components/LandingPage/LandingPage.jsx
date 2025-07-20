import { useModal } from "../../context/Modal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import { FaClipboardList, FaFileAlt, FaBriefcase } from "react-icons/fa";
import "../LandingPage/LandingPage.css";

function LandingPage() {
  const { setModalContent } = useModal();

  return (
    <div className="landing-page">
      {/* LEFT SIDE — Value Pitch */}
      <div className="left-side">
        <h1>Job Hunting. Organized.</h1>
        <p className="info-text">
          CodeHire gives you everything you need to track applications, generate
          resumes, and stay on top of your job search, all in one sleek
          interface.
        </p>

        <ul className="features-list">
          <li>
            <FaClipboardList className="feature-icon" /> Track jobs & follow-ups
          </li>
          <li>
            <FaFileAlt className="feature-icon" /> Build resumes with AI assist
          </li>
          <li>
            <FaBriefcase className="feature-icon" /> Save listings, add notes, and more!
          </li>
        </ul>
      </div>

      {/* RIGHT SIDE — CTA Box */}
      <div className="right-side">
        <div className="cta-container">
          <h2>Start Your Job Search Smarter</h2>
          <p className="cta-text">
            “CodeHire helped me organize my job hunt and land 3 interviews, all
            in a week!” - <i>Sarah M., Software Engineer</i>
          </p>
          <button
            className="cta-button"
            onClick={() => setModalContent(() => SignupFormModal)}
          >
            Sign Up Free
          </button>
          <p className="subtext">
            Already have an account?{" "}
            <span
              className="link-span"
              onClick={() => setModalContent(() => LoginFormModal)}
            >
              Log in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
