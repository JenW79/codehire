import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import "../SpotDetailsPage/SpotDetailsPage.css";
import { calculateRating } from "../../utils/calculatingRating";

function SpotDetailsPage() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currentSpot);
  const user = useSelector((state) => state.session.user);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <h2>Loading spot details...</h2>;

 
  const reviewsArray = [...(spot.Reviews?.Reviews || [])].reverse();
  const { avgRating, numReviews } = calculateRating(reviewsArray);

  

  const hasReviewed = reviewsArray.some(review => review.userId === user?.id);
  const isOwner = user?.id === spot.Owner?.id;

  return (
    <div className="spot-details-container">
      
      <h1 className="spot-title">{spot.name}</h1>
      <p className="spot-location">{spot.city}, {spot.state}, {spot.country}</p>

     
<div className="spot-images-container">
         
<img 
  src={spot.previewImage || (spot.SpotImages?.length > 0 ? spot.SpotImages[0].url : "https://res.cloudinary.com/dhxnqjcvf/image/upload/v1739144200/unnamed_mxhpr0.jpg")} 
  alt="Main Spot" 
  className="main-image" 
/>
 
<div className="grid-images">
  {spot.SpotImages?.slice(1, 5).map((image, index) => (
    <img 
      key={image.id || `placeholder-${index}`} 
      src={image.url || "https://res.cloudinary.com/dhxnqjcvf/image/upload/v1739144200/unnamed_mxhpr0.jpg"} 
      alt={`Spot ${index + 1}`} 
      className="grid-image" 
    />
  ))}

  
  {Array.from({ length: Math.max(0, 4 - (spot.SpotImages?.length - 1)) }).map((_, index) => (
    <img 
      key={`placeholder-${index}`} 
      src="https://res.cloudinary.com/dhxnqjcvf/image/upload/v1739144200/unnamed_mxhpr0.jpg"
      alt="Placeholder" 
      className="grid-image placeholder-image"
    />
  ))}
</div>
</div>

      
      <h2 className="spot-host">Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
      
      <div className="spot-info-container1">
        <div className="spot-description">
          <p><strong>{spot.description}</strong></p>
        </div>
        <div className="spot-reserve-section">
        <div className="price-rating-container">
         <h3 className="price-box">${spot.price} <span className="night">night</span></h3>
         <p className="spot-rating3">
          <i className="fa-solid fa-star"></i> {avgRating} · {numReviews} reviews
           </p>
        </div>
          <button className="reserve-button" onClick={() => alert("Feature Coming Soon!")}>Reserve</button>
        </div>
        
      </div>

      
      <div className="reviews-section">
      <p className="spot-rating2">
          <i className="fa-solid fa-star"></i> {avgRating} · {numReviews} reviews
           </p>
      {user && !isOwner && !hasReviewed && (
          <button className="post-review-btn" onClick={() => setShowReviewModal(true)}>Post Your Review</button>
        )}
        
        {reviewsArray.length > 0 ? (
          reviewsArray.map(review => (
            <div key={review.id} className="review">
              <p className="user">{review.User?.username || "Anonymous"}</p>
              <p className="date">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              <p><strong>{review.review}</strong></p>
              {user?.id === review.userId && (
                <button className="delete-review-btn" onClick={() => {
                  setSelectedReviewId(review.id);
                  setShowDeleteModal(true);
                }}>Delete</button>
              )}
            </div>
          ))
        ) : (
          user && !isOwner && !hasReviewed && (
            <p>Be the first to post a review!</p>
          )
        )}
      </div>

      {showReviewModal && <PostReviewModal spotId={spotId} onClose={() => setShowReviewModal(false)} />}
      {showDeleteModal && <DeleteReviewModal reviewId={selectedReviewId} spotId={spotId} onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
}

export default SpotDetailsPage;
