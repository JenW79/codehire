import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Fetch all spots
export const fetchAllSpots = createAsyncThunk(
  "spots/fetchAllSpots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/spots");
      if (!response.ok) {
        throw new Error("Failed to fetch spots");
      }
      const data = await response.json();
      return data.spots;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a spot
export const deleteSpot = createAsyncThunk(
  "spots/deleteSpot",
  async (spotId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/spots/${spotId}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "XSRF-Token": Cookies.get("XSRF-TOKEN"),
         },
      });

      if (!response.ok) {
        throw new Error("Failed to delete spot");
      }

      return spotId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch spot details
export const fetchSpotDetails = createAsyncThunk(
  "spots/fetchSpotDetails",
  async (spotId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/spots/${spotId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch spot details");
      }
      const spotDetails = await response.json();
      
      // Fetch Reviews
      const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
      if (reviewsResponse.ok) {
        const reviews = await reviewsResponse.json();
        spotDetails.Reviews = reviews; 
      } else {
        spotDetails.Reviews = []; 
      }

      return spotDetails;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Fetch current user's spots
export const fetchCurrentUserSpots = createAsyncThunk(
  "spots/fetchCurrentUserSpots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/spots/current");
      if (!response.ok) {
        throw new Error("Failed to fetch spots");
      }
      return await response.json(); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const createSpot = createAsyncThunk(
  "spots/createSpot",
  async (spotData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "XSRF-Token": Cookies.get("XSRF-TOKEN") 
        },
        body: JSON.stringify(spotData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create spot");
      }

      return data; // Return the new spot object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSpot = createAsyncThunk(
  "spots/updateSpot",
  async ({ spotId, ...updatedData }, { rejectWithValue }) => {
    try {
      
      const response = await fetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "XSRF-Token": Cookies.get("XSRF-TOKEN"), 
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();

      if (!response.ok) {
         
        return rejectWithValue(responseData.message);
      }

      
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Spot Slice
const spotsSlice = createSlice({
  name: "spots",
  initialState: {
    userSpots: [],
    allSpots: [],
    currentSpot: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUserSpots.fulfilled, (state, action) => {
        if (action.payload && action.payload.spots) {
          state.userSpots = action.payload.spots;
        } else {
          state.userSpots = [];
        }
        state.status = "succeeded";
      })
      .addCase(fetchCurrentUserSpots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSpot.fulfilled, (state, action) => {
        state.userSpots = state.userSpots.filter((spot) => spot.id !== action.payload);
      })
      .addCase(deleteSpot.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAllSpots.fulfilled, (state, action) => {
        state.allSpots = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAllSpots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSpotDetails.fulfilled, (state, action) => {
        state.currentSpot = action.payload;
      })
      .addCase(fetchSpotDetails.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createSpot.fulfilled, (state, action) => {
        state.userSpots.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSpot.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(updateSpot.fulfilled, (state, action) => {
        state.currentSpot = action.payload; 
        state.userSpots = state.userSpots.map((spot) =>
          spot.id === action.payload.id ? action.payload : spot
        );
        state.status = "succeeded";
      });
  },
});

export default spotsSlice.reducer;

