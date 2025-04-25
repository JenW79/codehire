import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteReview } from "../../store/reviews";
import { fetchSpotDetails } from "../../store/spots";
import "./DeleteReviewModal.css";

function DeleteReviewModal({ reviewId, spotId, onClose }) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDelete = async () => {
    await dispatch(deleteReview(reviewId)).unwrap();
    dispatch(fetchSpotDetails(spotId)); // Refresh the reviews after deletion
    onClose();
  };

  return (
    <div className="delete-review-modal">
      <div className="delete-review-content" ref={modalRef}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>

        <button className="delete-btn" onClick={handleDelete}>
          Yes (Delete Review)
        </button>
        <button className="cancel-btn" onClick={onClose}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
