import React, { useState } from "react";
import { Box, IconButton, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const ProfileImageContainer = styled(Box)({
  position: "relative",
  display: "inline-block",
});

const OverlayButton = styled(Box)({
  position: "absolute",
  bottom: "0",
  right: "0",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  borderRadius: "50%",
  padding: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

function AvatarButton() {
  const [image, setImage] = useState<string>("/default-profile.png");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      // Upload logic goes here
    }
  };

  return (
    <ProfileImageContainer>
      <Avatar src={image} sx={{ width: 170, height: 170 }} />

      <OverlayButton>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <AddAPhotoIcon sx={{ color: "white" }} />
          </IconButton>
        </label>
      </OverlayButton>
    </ProfileImageContainer>
  );
}

export default AvatarButton;
