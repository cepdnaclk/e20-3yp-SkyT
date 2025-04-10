import { Typography, TextField, Button, Stack, Grid } from "@mui/material";
import { useState } from "react";
import AvatarButton from "../components/AvatarButton";

function Profile() {
  // Example user data - ideally should come from auth context or API
  const user = {
    username: "john_doe",
    role: "Admin",
    email: "john@example.com",
    fname: "John",
    lname: "Doe",
    profilePic: "/default-profile.png", // placeholder
  };

  const [fname, setFname] = useState(user.fname);
  const [lname, setLname] = useState(user.lname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // API call to update user details
    console.log("Updated Info:", { fname, lname, email, password });
  };

  return (
    <Grid
      container
      width={"100%"}
      height={"100%"}
      fontFamily={"Montserrat"}
      p={5}
      spacing={5}
      overflow={"auto"}
    >
      <Grid
        size={{ xs: 12, md: 4 }}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={1}
      >
        <AvatarButton />

        <Typography
          variant="h4"
          color="textSecondary"
          fontFamily={"inherit"}
          fontWeight={700}
        >
          {user.fname} {user.lname}
        </Typography>

        <Typography
          variant="h5"
          color="textSecondary"
          fontFamily={"inherit"}
          fontWeight={600}
        >
          {user.username}
        </Typography>

        <Typography
          variant="h6"
          color="textSecondary"
          fontFamily={"inherit"}
          fontWeight={500}
        >
          ({user.role})
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }} container>
        <Stack gap={3} width={"100%"} maxWidth={"400px"}>
          <TextField
            label="First Name"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            fullWidth
          />

          <TextField
            label="Last Name"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Current Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update Profile
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default Profile;
