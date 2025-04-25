import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

//CREATE Review Thunk
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async ({ spotId, review, stars }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "XSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({ review, stars }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create review");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// DELETE Review Thunk
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "XSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message);
      }

      return reviewId; 
    } catch (error) {
      return rejectWithValue("Failed to delete review.");
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    status: "idle",
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((review) => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reviewsSlice.reducer;