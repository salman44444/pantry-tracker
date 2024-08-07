import { firestore as db, storage } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CameraUpload from "./cameraupload";
import OpenAI from "openai";

const categories = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Meat",
  "Beverages",
  "General",
];

const AddForm = ({ initialData = {}, onClose }) => {
  console.log("Initial Data:", initialData); // Logging initialData

  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    picture: initialData?.picture || null,
    category: initialData?.category || "",
    price: initialData?.price || "",
    quantity: initialData?.quantity || "",
    pictureURL: initialData?.pictureURL || "",
  });

  const [cameraImageUrl, setCameraImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let downloadUrl = cameraImageUrl || formData.pictureURL;
      if (formData.picture && formData.picture !== initialData.picture) {
        const storageRef = ref(storage, `pictures/${formData.picture.name}`);
        const snapshot = await uploadBytes(storageRef, formData.picture);
        downloadUrl = await getDownloadURL(snapshot.ref);
      }
      const itemData = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        quantity: formData.quantity,
        pictureURL: downloadUrl,
      };
      if (initialData?.id) {
        const itemDocRef = doc(db, "pantryItems", initialData.id);
        const itemDocSnapshot = await getDoc(itemDocRef);

        if (itemDocSnapshot.exists()) {
          await updateDoc(itemDocRef, itemData);
        } else {
          console.error("No document to update");
          await setDoc(itemDocRef, itemData);
        }
      } else {
        const newitemDocRef = doc(db, "pantryItems", itemData.id);
        await setDoc(newitemDocRef, itemData);
      }

      console.log("Form submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      picture: e.target.files[0],
      pictureURL: "",
    });
  };

  return (
    <Box marginTop={5}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="picture">
              <Input
                accept="image/*"
                id="picture"
                type="file"
                onChange={handleFileChange}
              />
              <Button variant="contained" component="span">
                Upload Picture
              </Button>
            </label>
            {formData.picture && (
              <Typography>{formData.picture.name}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <CameraUpload onUpload={(url) => setCameraImageUrl(url)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddForm;
