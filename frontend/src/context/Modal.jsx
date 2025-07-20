import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import "./Modal.css"; 

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalContent, _setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);
  const modalRootRef = useRef(null);

  useEffect(() => {
    modalRootRef.current = document.getElementById("modal-root");
  }, []);

  const setModalContent = (Component) => {
    if (typeof Component !== "function") {
      console.error("❌ Invalid modal content passed:", Component);
      throw new Error("setModalContent expects a component function (not JSX or a closure).");
    }
    console.log("🛎 Opening modal:", Component);
    _setModalContent(Component);
  };

  const closeModal = () => {
    _setModalContent(null);
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const value = {
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
    modalRoot: modalRootRef.current,
  };

  console.log("📦 modalContent:", modalContent);
  console.log("🪟 modalRoot:", modalRootRef.current);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function Modal() {
  const { modalContent, closeModal, modalRoot } = useContext(ModalContext);

  if (!modalContent || !modalRoot) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">
        {React.createElement(modalContent)}
      </div>
    </div>,
    modalRoot
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
