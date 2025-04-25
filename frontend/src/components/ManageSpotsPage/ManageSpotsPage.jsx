import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserSpots, deleteSpot } from "../../store/spots"; 
import { useNavigate } from "react-router-dom";
import "../ManageSpotsPage/ManageSpots.css";
import { calculateRating } from "../../utils/calculatingRating";

function ManageSpotsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user); 
  const spots = useSelector((state) => state.spots.userSpots);
  const status = useSelector((state) => state.spots.status);
  const error = useSelector((state) => state.spots.error);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);



  useEffect(() => {
    if (user) dispatch(fetchCurrentUserSpots());
    else navigate("/login"); // Redirect unauthorized users
  }, [dispatch, user, navigate]);

  if (status === "loading") return <h2>Loading spots...</h2>;
  if (status === "failed") return <h2>Error: {error}</h2>;
  
  if (!spots || spots.length === 0) {

    return (
      <div className="manage-spots-container">
        <h1>Manage Your Spots</h1>
        <button className="create-spot-btn" onClick={() => navigate("/spots/new")}>
          Create a New Spot
        </button>
        <h3>You have no spots listed yet.</h3>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!spotToDelete) return;
  
    try {
      await dispatch(deleteSpot(spotToDelete)).unwrap();
      dispatch(fetchCurrentUserSpots()); 
      setShowDeleteModal(false); 
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="manage-spots-container">
      <h1>Manage Your Spots</h1>
      <button className="create-spot-btn" onClick={() => navigate("/spots/new")}>
        Create a New Spot
      </button>
      <div className="spots-grid">
        {spots.map((spot) => {
          
          const { avgRating, numReviews } = calculateRating(spot.Reviews || []); 

          return (
            <div key={spot.id} className="spot-card">
              <img 
                src={spot.previewImage || "https://res.cloudinary.com/dhxnqjcvf/image/upload/v1739144200/unnamed_mxhpr0.jpg"} 
                alt={spot.name} 
                className="spot-thumbnail" 
              />
             <div className="spot-info">
  <div className="spot-header">
    <p className="spot-location1">{spot.city}, {spot.state}</p>
    <div className="spot-rating4">
      <i className="fa-solid fa-star"></i> {avgRating} · {numReviews}
    </div>
  </div>
                <p><strong>${spot.price}</strong> night</p>
              </div>
              <div className="spot-buttons">

              {showDeleteModal && (
  <div className="delete-modal">
    <div className="modal-content">
      <h3>Confirm Delete</h3>
      <p>Are you sure you want to remove this spot from the listings?</p>

      <div className="modal-buttons">
        <button className="confirm-delete" onClick={handleDelete}>Yes (Delete Spot)</button>
        <button className="cancel-delete" onClick={() => setShowDeleteModal(false)}>No (Keep Spot)</button>
      </div>
    </div>
  </div>
)}
                <button className="update-btn" onClick={() => navigate(`/spots/${spot.id}/edit`)}>
                  Update
                </button>
                <button className="delete-btn1" onClick={() => {
                  setSpotToDelete(spot.id);
                  setShowDeleteModal(true);
                }}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ManageSpotsPage;





