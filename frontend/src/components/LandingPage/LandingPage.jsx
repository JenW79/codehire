import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSpots } from "../../store/spots"; 
import { useNavigate } from "react-router-dom";
import "../LandingPage/LandingPage.css";
import { calculateRating } from "../../utils/calculatingRating";

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  if (!spots || spots.length === 0) {
    return <h2>Loading spots...</h2>;
  }

  return (
    <div className="spots-container">
      {spots.map((spot) => {
       const { avgRating } = calculateRating(spot.Reviews || []);

        return (
          <div 
            key={spot.id} 
            className="spot-tile" 
            onClick={() => navigate(`/spots/${spot.id}`)} 
            title={spot.name} 
          >
            <div className="spot-image-container">
              <img 
                src={spot.previewImage} 
                alt={spot.name} 
                className="spot-image" 
              />
            </div>

            <div className="spot-info-container">
              <div className="spot-info">
                <div className="spot-location">
                  {spot.city}, {spot.state}
                </div>
                <div className="spot-price">
                  ${spot.price} <span className="night1"> night</span>
                </div>
              </div>

              <div className="spot-rating">
                <i className="fa-solid fa-star"></i> {avgRating} 
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LandingPage;
