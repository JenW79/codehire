import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSpot, updateSpot, fetchSpotDetails } from "../../store/spots";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateSpotForm.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams(); 
  const user = useSelector((state) => state.session.user);
  const existingSpot = useSelector((state) => state.spots.currentSpot);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    lng: "",
    title: "",
    price: "",
    description: "",
    previewImage: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spotId) {
      dispatch(fetchSpotDetails(spotId)); 
    }
  }, [dispatch, spotId]);

  useEffect(() => {
    if (existingSpot && spotId) {
      setFormData({
        address: existingSpot.address || "",
        city: existingSpot.city || "",
        state: existingSpot.state || "",
        country: existingSpot.country || "",
        lat: existingSpot.lat || "",
        lng: existingSpot.lng || "",
        title: existingSpot.name || "",
        price: existingSpot.price || "",
        description: existingSpot.description || "",
        previewImage: existingSpot.previewImage || "",
        image1: existingSpot.SpotImages?.[1]?.url || "",
        image2: existingSpot.SpotImages?.[2]?.url || "",
        image3: existingSpot.SpotImages?.[3]?.url || "",
        image4: existingSpot.SpotImages?.[4]?.url || "",
      });
    }
  }, [existingSpot, spotId]);

  if (!user) {
    navigate("/login");
  }

  if (spotId && !formData) return <h2>Loading spot details...</h2>

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    const imageRegex = /\.(png|jpg|jpeg)$/i;

    if (formData.description.length < 30) {
      newErrors.description = "Description must be at least 30 characters.";
    }
    if (!formData.previewImage || !imageRegex.test(formData.previewImage)) {
      newErrors.previewImage = "Preview Image is required.";
    }

    ["image1", "image2", "image3", "image4"].forEach((imageField) => {
      if (formData[imageField] && !imageRegex.test(formData[imageField])) {
        newErrors[imageField] = "Each image must be a valid URL ending in .png, .jpg, or .jpeg.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (spotId) {
        // **Updating an existing spot**
        await dispatch(
          updateSpot({
            spotId,
            name: formData.title,
            description: formData.description,
            price: formData.price,
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            previewImage: formData.previewImage,
          })

        ).unwrap();
        navigate("/spots/current"); // Redirect to Manage Spots after updating
      } else {
        // **Creating a new spot**
        const newSpot = await dispatch(
          createSpot({
            name: formData.title,
            description: formData.description,
            price: formData.price,
            lat: formData.lat ? parseFloat(formData.lat) : null,
            lng: formData.lng ? parseFloat(formData.lng) : null,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            previewImage: formData.previewImage,
          })
        ).unwrap();

        await fetch(`/api/spots/${newSpot.id}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: [formData.image1, formData.image2, formData.image3, formData.image4].filter(Boolean),
          }),
        });
        navigate(`/spots/${newSpot.id}`);
      }
    } catch (error) {
      setErrors({ api: error.message });
    }
  };

  return (
    <div className="create-spot-container">
      <h1>{spotId ? "Update Your Spot" : "Create a New Spot"}</h1>
      <form onSubmit={handleSubmit}>
        <h3>Where&apos;s your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>
        <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Street Address"  value={formData.address} onChange={handleChange} required />
        
        <div className="inline-inputs">
          <div className="input-group">
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
            <span>,</span>
            <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
          </div>
        </div>

        <div className="inline-inputs">
          <div className="input-group">
            <input type="number" name="lat" placeholder="Latitude (Optional)" value={formData.lat} onChange={handleChange} />
            <span>,</span>
            <input type="number" name="lng" placeholder="Longitude (Optional)"value={formData.lng} onChange={handleChange} />
          </div>
        </div>

        <h3>Describe your place to guests</h3>
        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
        <textarea name="description" placeholder="Please write at least 30 characters" value={formData.description} onChange={handleChange} required />
        {errors.description && <p className="error">{errors.description}</p>}

        <h3>Create a title for your spot</h3>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
        <input type="text" name="title" placeholder="Name of your spot" value={formData.title} onChange={handleChange} required />

        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <input type="number" name="price" placeholder="$ Price per night (USD)" value={formData.price} onChange={handleChange} required />

        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input type="url" name="previewImage" placeholder="Preview Image URL" value={formData.previewImage} onChange={handleChange} required />
        {errors.previewImage && <p className="error">{errors.previewImage}</p>}
        <input type="url" name="image1" placeholder="Image URL" value={formData.image1}  onChange={handleChange} />
        {errors.image1 && <p className="error">{errors.image1}</p>}
        <input type="url" name="image2" placeholder="Image URL" value={formData.image2} onChange={handleChange} />
        {errors.image1 && <p className="error">{errors.image2}</p>}
        <input type="url" name="image3" placeholder="Image URL" value={formData.image3} onChange={handleChange} />
        {errors.image1 && <p className="error">{errors.image3}</p>}
        <input type="url" name="image4" placeholder="Image URL" value={formData.image4} onChange={handleChange} />
        {errors.image1 && <p className="error">{errors.image4}</p>}
        
        {errors.api && <p className="error">{errors.api}</p>}
        <button type="submit">{spotId ? "Save Changes" : "Create Spot"}</button>

      </form>
    </div>
  );
}

export default CreateSpotForm;


