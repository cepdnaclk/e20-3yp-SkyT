import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import TextBox from "./TextBox";

interface EstateProps {
  estateId: number;
  estate: string;
}

interface UserFormValues {
  id: number;
  fName: string;
  lName: string;
  email: string;
  role: string;
  estates: number[];
  img: string | null;
}

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
  initialValues: UserFormValues;
  estates?: EstateProps[];
  isEditMode?: boolean;
  user?: string;
}

interface FormErrorsProps {
  fName: boolean;
  email: boolean;
  role: boolean;
  estates: boolean;
}

const roleOptions = ["Owner", "Developer", "Assistant"];

const errorFree: FormErrorsProps = {
  fName: false,
  email: false,
  role: false,
  estates: false,
};

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function FormDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
  estates,
  isEditMode = false,
  user,
}: UserFormDialogProps) {
  const [formValues, setFormValues] = useState<UserFormValues>(initialValues);
  const [error, setError] = useState<FormErrorsProps>(errorFree);

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChecked = (estateId: number) => {
    const selected = formValues.estates.includes(estateId);
    const updatedEstates = selected
      ? formValues.estates.filter((e) => e !== estateId)
      : [...formValues.estates, estateId];

    console.log("Updated Estates: ", updatedEstates);

    setFormValues((prev) => ({ ...prev, estates: updatedEstates }));
  };

  const handleSubmit = () => {
    console.log("Verifying Details");

    const err: FormErrorsProps = {
      fName: !formValues.fName,
      email: !emailPattern.test(formValues.email),
      role:
        !formValues.role ||
        !roleOptions.includes(formValues.role) ||
        (user?.toLowerCase() !== "developer" &&
          formValues.role !== "Assistant"),
      estates: formValues.estates.length === 0,
    };

    setError(err);

    if (!err.email && !err.estates && !err.fName && !err.role) {
      console.log("Form submitted", formValues);
      onSubmit(formValues);
    }
  };

  useEffect(() => {
    if (
      formValues.role?.toLowerCase() === "developer" &&
      estates &&
      estates.length > 0
    ) {
      const estList = estates.map((est) => est.estateId);
      console.log("Developer Access: ", estList);

      setFormValues((prev) => {
        // Avoid updating if values are already the same
        if (
          Array.isArray(prev.estates) &&
          JSON.stringify(prev.estates) === JSON.stringify(estList)
        ) {
          return prev;
        }

        return { ...prev, estates: estList };
      });
    }
  }, [formValues.role, estates]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ fontFamily: "Montserrat" }}
    >
      <DialogTitle fontFamily={"inherit"} fontWeight={600}>
        {isEditMode ? "Edit Member Information" : "Add New Member"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextBox
              label="First Name"
              name="fName"
              value={formValues.fName}
              onChange={handleChange}
              fullWidth
              required
              disabled={!!initialValues.fName}
              error={error.fName}
              helperText={error.fName && "This field is required!"}
            />
          </Grid>

          <Grid size={6}>
            <TextBox
              label="Last Name (optional)"
              name="lName"
              value={formValues.lName}
              onChange={handleChange}
              fullWidth
              disabled={!!initialValues.lName}
            />
          </Grid>

          <Grid size={12}>
            <TextBox
              label="Email Address"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              fullWidth
              required
              disabled={!!initialValues.email}
              error={error.email}
              helperText={error.email && "Invalid email address!"}
            />
          </Grid>

          <Grid size={12}>
            <TextBox
              select
              label="Role"
              name="role"
              value={formValues.role}
              onChange={handleChange}
              fullWidth
              required
              disabled={user?.toLowerCase() !== "developer"}
              error={error.role}
              helperText={error.role && "Invalid!"}
            >
              {roleOptions.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextBox>
          </Grid>

          <Grid size={12}>
            <Typography fontFamily={"Montserrat"}>Estates*</Typography>

            <FormGroup>
              <Grid container>
                {estates?.map((estate) => (
                  <Grid key={estate.estateId} size={{ xs: 6 }}>
                    <FormControlLabel
                      disabled={formValues.role?.toLowerCase() === "developer"}
                      control={
                        <Checkbox
                          checked={formValues.estates.includes(estate.estateId)}
                          onChange={() => handleChecked(estate.estateId)}
                        />
                      }
                      label={estate.estate}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ fontFamily: "inherit", fontWeight: 650 }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          autoFocus
          sx={{ fontFamily: "inherit", fontWeight: 650 }}
        >
          {isEditMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormDialog;
