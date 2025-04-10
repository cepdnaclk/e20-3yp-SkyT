import {
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import AvatarButton from "../components/AvatarButton";
import TextBox from "../components/TextBox";
import FillButton from "../components/FillButton";

interface userInfoProps {
  username: string;
  role: string;
  email: string;
  fname: string;
  lname: string;
  profilePic: string;
}

interface passwordProps {
  currentPwd: string | null;
  newPwd: string | null;
  confirmPwd: string | null;
}

interface errorProps {
  name: boolean;
  email: boolean;
  pwd: boolean;
}

// Example user data - ideally should come from auth context or API
const user = {
  username: "john_doe",
  role: "Admin",
  email: "john@example.com",
  fname: "John",
  lname: "Doe",
  profilePic: "/default-profile.png", // placeholder
};

const pwd: passwordProps = {
  currentPwd: null,
  newPwd: null,
  confirmPwd: null,
};

const errInit: errorProps = {
  name: false,
  email: false,
  pwd: false,
};

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Profile() {
  const [userInfo, setUserInfo] = useState<userInfoProps>(user);
  const [password, setPassword] = useState<passwordProps>(pwd);
  const [error, setError] = useState<errorProps>(errInit);
  const [pwdError, setPwdError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");

  const handleSubmit = () => {
    // Input Validation
    const err: errorProps = {
      name: !userInfo.fname,
      email: !emailPattern.test(userInfo.email),
      pwd: password.newPwd !== password.confirmPwd,
    };

    setError(err);

    if (!err.email && !err.name && !err.pwd) {
      updateInfo();
    }
  };

  const updateInfo = async () => {
    setLoading(true);
    const data = {
      userInfo,
      curPwd: password.currentPwd,
      newPwd: password.newPwd,
    };

    try {
      console.log("update info: ", data);
      setPwdError(false);
    } catch (err) {
      console.log("Update failed!", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Info [${name}] : ${value}`);

    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Password [${name}] : ${value}`);

    setPassword((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={2} fontFamily={"Montserrat"} height={"100%"}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Grid size={12} mb={2}>
          <Typography fontFamily={"inherit"} fontWeight={600}>
            Profile Picture
          </Typography>
        </Grid>

        <Grid
          size={12}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={1}
        >
          <AvatarButton image={image} setImage={setImage} />

          <Typography
            variant="h4"
            color="textSecondary"
            fontFamily={"inherit"}
            fontWeight={700}
            mt={2}
          >
            {userInfo.fname} {userInfo.lname}
          </Typography>

          <Typography
            variant="h5"
            color="textSecondary"
            fontFamily={"inherit"}
            fontWeight={600}
          >
            {userInfo.username}
          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            fontFamily={"inherit"}
            fontWeight={500}
          >
            ({userInfo.role})
          </Typography>
        </Grid>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6, lg: 8 }}
        maxHeight={"100%"}
        container
        overflow={"auto"}
      >
        <Grid size={12}>
          <Typography fontFamily={"inherit"} fontWeight={600}>
            General Information
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TextBox
            name="fname"
            label="First Name"
            value={userInfo.fname}
            onChange={handleInfo}
            fullWidth
            required
            error={error.name}
            helperText={error.name && "This field is required!"}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TextBox
            name="lname"
            label="Last Name"
            value={userInfo.lname}
            onChange={handleInfo}
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TextBox
            name="email"
            label="Email Address"
            type="email"
            value={userInfo.email}
            onChange={handleInfo}
            fullWidth
            required
            error={error.email}
            helperText={error.email && "Invalid email address!"}
          />
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>

        <Grid size={12}>
          <Typography fontFamily={"inherit"} fontWeight={600}>
            Security Information
          </Typography>

          {(error.pwd || pwdError) && (
            <Stack mt={2}>
              {pwdError && <Alert severity="error">Invalid password!</Alert>}

              {error.pwd && (
                <Alert severity="error">Password doesn't match!</Alert>
              )}
            </Stack>
          )}
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TextBox
            name="currentPwd"
            label="Current Password"
            type="password"
            value={password?.currentPwd}
            onChange={handlePassword}
            fullWidth
            error={pwdError}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TextBox
            name="newPwd"
            label="New Password"
            type="password"
            value={password?.newPwd}
            onChange={handlePassword}
            fullWidth
            error={error.pwd}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TextBox
            name="confirmPwd"
            label="Confirm Password"
            type="password"
            value={password?.confirmPwd}
            onChange={handlePassword}
            fullWidth
            error={error.pwd}
          />
        </Grid>

        <Grid size={12}>
          <FillButton
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: "5px",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Profile"
            )}
          </FillButton>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Profile;
