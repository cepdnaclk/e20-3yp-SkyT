import React from "react";
import { Box, IconButton, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

interface AvatarButtonProps {
  imagePreview: string | undefined;
  setImagePreview: (preview: string) => void;
  setImageFile: (imgFile: File) => void;
}

const ProfileImageContainer = styled(Box)({
  position: "relative",
  display: "inline-block",
});

const OverlayButton = styled(Box)({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  borderRadius: "50%",
  padding: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

function AvatarButton({
  setImageFile,
  imagePreview,
  setImagePreview,
}: AvatarButtonProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
      setImageFile(file);
      console.log("Image: ", imageURL);
    }
  };

  return (
    <ProfileImageContainer>
      <Avatar src={imagePreview} sx={{ width: 170, height: 170 }} />

      <label htmlFor="icon-button-file">
        <OverlayButton>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="icon-button-file"
            type="file"
            onChange={handleImageChange}
          />
          <IconButton color="primary" component="span">
            <AddAPhotoIcon sx={{ color: "white" }} />
          </IconButton>
        </OverlayButton>
      </label>
    </ProfileImageContainer>
  );
}

export default AvatarButton;
