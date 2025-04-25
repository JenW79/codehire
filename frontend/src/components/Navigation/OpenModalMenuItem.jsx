
import { useModal } from '../../context/Modal';

function OpenModalMenuItem({
  modalComponent, // component to render inside modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function when clicked
  onModalClose // optional: callback function when modal closes
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return <li onClick={onClick}>{itemText}</li>;
}

export default OpenModalMenuItem;