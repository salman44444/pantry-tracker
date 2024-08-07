// components/CameraUpload.js
import React, { useRef, useState } from "react";
import { Button, Box } from "@mui/material";
import { Camera } from "react-camera-pro";

const CameraUpload = ({ onUpload }) => {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const takePhoto = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
    onUpload(photo);
    setShowCamera(false);
  };

  return (
    <Box>
      {showCamera ? (
        <Box>
          <Camera ref={cameraRef} aspectRatio={16 / 9} />
          <Button onClick={takePhoto}>Take Photo</Button>
        </Box>
      ) : (
        <Button variant="contained" onClick={() => setShowCamera(true)}>
          Open Camera
        </Button>
      )}
      {image && (
        <Box>
          <img src={image} alt="Captured" style={{ width: "100%", marginTop: "10px" }} />
        </Box>
      )}
    </Box>
  );
};

export default CameraUpload;
