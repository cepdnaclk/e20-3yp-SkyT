import {
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AvatarButton from "../components/AvatarButton";
import TextBox from "../components/TextBox";
import FillButton from "../components/FillButton";
import { useAuth } from "../context/AuthContext";
import { getData, postData, updateData } from "../api/NodeBackend";
import { ToastAlert } from "../components/ToastAlert";
import { AxiosError } from "axios";
import EmailDialog from "../components/EmailDialog";
import { useLoading } from "../context/LoadingContext";

interface userInfoProps {
  userId: number;
  role: string;
  email: string;
  fName: string;
  lName: string;
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

interface ErrorResponse {
  error: string;
}

const pwd: passwordProps = {
  currentPwd: null,
  newPwd: null,
  confirmPwd: null,
};

// Example user data - ideally should come from auth context or API
const usr: userInfoProps = {
  userId: 0,
  role: "",
  email: "",
  fName: "",
  lName: "",
  profilePic: "",
};

const errInit: errorProps = {
  name: false,
  email: false,
  pwd: false,
};

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const BASE_URL = import.meta.env.VITE_BACKEND;

function Profile() {
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const [userInfo, setUserInfo] = useState<userInfoProps>(usr);
  const [password, setPassword] = useState<passwordProps>(pwd);
  const [error, setError] = useState<errorProps>(errInit);
  const [pwdError, setPwdError] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  const handleSubmit = () => {
    // Input Validation
    const err: errorProps = {
      name: !userInfo.fName,
      email: !emailPattern.test(userInfo.email),
      pwd: password.newPwd !== password.confirmPwd,
    };

    setError(err);
    if (!err.email && !err.name && !err.pwd) {
      if (email !== userInfo.email) {
        console.log("Validating Email");
        validateEmail();
      } else {
        updateInfo();
      }
    }
  };

  const validateEmail = async () => {
    const data = {
      newEmail: userInfo.email,
      userId: userInfo.userId,
    };

    setLoading(true);

    try {
      const servereResponse = await postData(data, "auth/email");
      if (servereResponse.status === 200) {
        console.log(servereResponse.data.message);
        setOpen(true);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 401 || status === 404) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Profile Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });

      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const updateInfo = async () => {
    setBtnLoading(true);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userInfo", JSON.stringify(userInfo));
      formData.append("curPwd", password.currentPwd || "");
      formData.append("newPwd", password.newPwd || "");
      formData.append("emailCode", code);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const servereResponse = await updateData(formData, "users");
      if (servereResponse.status === 200) {
        const msg = servereResponse.data.message;
        console.log(msg);
        ToastAlert({
          type: "success",
          title: msg,
        });
      }
      setPwdError(false);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 404 || status === 400 || status === 401) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Profile Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setBtnLoading(false);
      setOpen(false);
      setLoading(false);
      getInfo();
    }
  };

  const getInfo = async () => {
    const url = "users/" + user?.userId;

    setBtnLoading(true);
    setLoading(true);

    try {
      const servereResponse = await getData(url);
      if (servereResponse.status === 200) {
        const result: userInfoProps = servereResponse.data.result;
        console.log(servereResponse.data.message);
        setUserInfo(result);
        setEmail(result.email);

        const path = `${BASE_URL}/${result.profilePic}`;
        setImagePreview(path);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 404 || status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Profile Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setBtnLoading(false);
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

  useEffect(() => {
    getInfo();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <AvatarButton
            setImageFile={setImageFile}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />

          <Typography
            variant="h4"
            color="textSecondary"
            fontFamily={"inherit"}
            fontWeight={700}
            mt={2}
          >
            {userInfo?.fName} {userInfo?.lName}
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
            name="fName"
            label="First Name"
            value={userInfo?.fName}
            onChange={handleInfo}
            fullWidth
            required
            error={error.name}
            helperText={error.name && "This field is required!"}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <TextBox
            name="lName"
            label="Last Name"
            value={userInfo.lName}
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
            disabled={btnLoading}
            sx={{
              borderRadius: "5px",
            }}
          >
            {btnLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Profile"
            )}
          </FillButton>
        </Grid>
      </Grid>

      <EmailDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={() => updateInfo()}
        code={code}
        setCode={setCode}
        onResend={() => validateEmail()}
      />
    </Grid>
  );
}

export default Profile;
