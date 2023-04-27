import React from "react";
import { useState } from "react";

// This component is used to preview the image before uploading it to the server
export const PreviewImage = ({ file }) => {
  // state to store the preview image
  const [previewImage, setPreviewImage] = useState(null);

  // Create a new FileReader instance to read the file
  const reader = new FileReader();

  if (file != null) {
    // Read the file and set the preview image
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  }

  // Render the preview image
  return (
    <div>
      <img
        src={previewImage}
        alt="Profile image"
        width="200px"
        height="200px"
        style={{ objectFit: "cover", borderRadius: "50%" }}
      />
    </div>
  );
};
