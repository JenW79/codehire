import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import { createReview } from "../../store/reviews"; 
import "./PostReviewModal.css";

function PostReviewModal({ spotId, onClose }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (review.length < 10) newErrors.review = "Review must be at least 10 characters long.";
    if (stars < 1) newErrors.stars = "Please select a star rating.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(createReview({ spotId, review, stars })).unwrap();
      dispatch(fetchSpotDetails(spotId)); 
      onClose(); 
    } catch (error) {
      let errorMessage = error?.payload || error?.message || error || "An error occurred";
      if (typeof errorMessage === "string") {
        setErrors({ api: errorMessage });
      } else {
        setErrors({ api: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className="review-modal">
      <div className="review-modal-content" ref={modalRef}>
        <h2>How was your stay?</h2>
        {errors.api && <p className="error">{errors.api}</p>}

        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        {errors.review && <p className="error">{errors.review}</p>}

        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= stars ? "filled" : ""} onClick={() => setStars(star)}>
              ★
            </span>
          ))}
        </div>
        {errors.stars && <p className="error">{errors.stars}</p>}

        <button onClick={handleSubmit} disabled={review.length < 10 || stars < 1}>
          Submit Review
        </button>
      </div>
    </div>
  );
}

export default PostReviewModal;
