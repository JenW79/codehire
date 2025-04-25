// src/utils/calculateRating.js
export const calculateRating = (reviewsArray) => {
    if (!reviewsArray || reviewsArray.length === 0) {
      return { avgRating: "New", totalStars: 0, numReviews: 0 };
    }
  
    const totalStars = reviewsArray.reduce((acc, review) => acc + review.stars, 0);
    const avgRating = (totalStars / reviewsArray.length).toFixed(1);
  
    return { avgRating, totalStars, numReviews: reviewsArray.length };
  };
  