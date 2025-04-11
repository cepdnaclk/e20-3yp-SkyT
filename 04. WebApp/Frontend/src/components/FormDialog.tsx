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

interface UserFormValues {
  id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  estates: string[];
  img: string | null;
}

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
  initialValues: UserFormValues;
  estates?: string[];
  isEditMode?: boolean;
}

interface FormErrorsProps {
  fname: boolean;
  email: boolean;
  role: boolean;
  estates: boolean;
}

const roleOptions = ["Owner", "Admin", "Maintain"];

const errorFree: FormErrorsProps = {
  fname: false,
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

  const handleChecked = (estate: string) => {
    const selected = formValues.estates.includes(estate);
    const updatedEstates = selected
      ? formValues.estates.filter((e) => e !== estate)
      : [...formValues.estates, estate];

    console.log("Updated Estates: ", updatedEstates);

    setFormValues((prev) => ({ ...prev, estates: updatedEstates }));
  };

  const handleSubmit = () => {
    console.log("Verifying Details");

    const err: FormErrorsProps = {
      fname: !formValues.fname,
      email: !emailPattern.test(formValues.email),
      role: !formValues.role || !roleOptions.includes(formValues.role),
      estates: formValues.estates.length === 0,
    };

    setError(err);

    if (!err.email && !err.estates && !err.fname && !err.role) {
      console.log("Form submitted", formValues);
      onSubmit(formValues);
    }
  };

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
              name="fname"
              value={formValues.fname}
              onChange={handleChange}
              fullWidth
              required
              disabled={!!initialValues.fname}
              error={error.fname}
              helperText={error.fname && "This field is required!"}
            />
          </Grid>

          <Grid size={6}>
            <TextBox
              label="Last Name (optional)"
              name="lname"
              value={formValues.lname}
              onChange={handleChange}
              fullWidth
              disabled={!!initialValues.lname}
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
                {estates?.map((estate, idx) => (
                  <Grid key={idx} size={{ xs: 6, md: 4 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formValues.estates.includes(estate)}
                          onChange={() => handleChecked(estate)}
                        />
                      }
                      label={estate}
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
