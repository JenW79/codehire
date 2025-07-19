import { useState, useContext, createContext, useEffect, useState as useReactState } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  const closeModal = () => {
    setModalContent(null);
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

export function Modal() {
  const { modalContent, closeModal } = useContext(ModalContext);
  const [modalRoot, setModalRoot] = useReactState(null);

  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"));
  }, []);

  if (!modalContent || !modalRoot) return null;

  const ModalComponent = modalContent;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content">
        <ModalComponent />
      </div>
    </div>,
    modalRoot
  );
}

export const useModal = () => useContext(ModalContext);
