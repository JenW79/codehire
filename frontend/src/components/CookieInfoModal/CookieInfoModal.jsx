import { FaCookieBite, FaLock, FaShieldAlt } from "react-icons/fa";
import "./CookieInfoModal.css";

export default function CookieInfoModal({ onClose }) {
  return (
    <div className="cookie-modal-backdrop" onClick={onClose}>
      <div className="cookie-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="cookie-modal-header">
          <FaCookieBite size={36} />
          <h2>Cookie Settings</h2>
        </div>
        <div className="cookie-modal-body">
          <p>
            We use a few essential cookies to keep your experience smooth:
          </p>
          <ul>
            <li><FaLock /> <strong>Session Cookie</strong> : Keeps you logged in securely</li>
            <li><FaShieldAlt /> <strong>CSRF Token</strong> : Protects against malicious requests</li>
          </ul>
          <p>
            That is it no tracking, no ads, no 3rd-party analytics. We respect your privacy.
          </p>
          <p>
            Want to manage browser cookies? You can do that in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}
