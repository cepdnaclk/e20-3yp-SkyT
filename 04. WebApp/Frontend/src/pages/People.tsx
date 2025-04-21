import {
  Grid,
  CircularProgress,
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Avatar,
  Stack,
  Tooltip,
} from "@mui/material";
import { BsPersonFillAdd } from "react-icons/bs";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";
import FillButton from "../components/FillButton";
import { FaUserEdit } from "react-icons/fa";
import AlertDialog from "../components/AlertDialog";
import { ImBin } from "react-icons/im";
import FormDialog from "../components/FormDialog";
import { useAuth } from "../context/AuthContext";
import { deleteData, getData, postData, updateData } from "../api/NodeBackend";
import { ToastAlert } from "../components/ToastAlert";
import { AxiosError } from "axios";

interface MemberProps {
  id: number;
  fName: string;
  lName: string;
  email: string;
  img: string | null;
  role: string;
  estates: number[];
}

interface ErrorResponse {
  error: string;
}

interface EstateProps {
  estateId: number;
  estate: string;
}

const newMember: MemberProps = {
  id: 0,
  fName: "",
  lName: "",
  email: "",
  img: null,
  role: "Assistant",
  estates: [],
};

function People() {
  const { user, superUsers } = useAuth();

  const [memberList, setMemberList] = useState<MemberProps[]>();
  const [estateList, setEstateList] = useState<EstateProps[]>();
  const [searchName, setSearchName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<MemberProps>(newMember);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteUser, setDeleteUser] = useState<number>();

  const handleEdit = (userId: number) => {
    const user = memberList?.filter((usr) => usr.id === userId);
    console.log("User: ", user);

    if (!!user && user.length > 0) {
      setFormData(user[0]);
      setFormOpen(true);
    }
  };

  const handleDelete = (userId: number) => {
    console.log("Delete: ", userId);
    setDeleteUser(userId);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    console.log("New user");
    setFormOpen(true);
    setFormData(newMember);
  };

  const handleSubmit = (values: MemberProps) => {
    if (values.id > 1) {
      console.log("Update User: ", values);
      updateMember(values.id, values.estates);
    } else {
      console.log("Add User: ", values);
      addMember(values);
    }

    setFormOpen(false);
  };

  const getEstateList = async () => {
    const url = "estates/list/" + user?.userId;

    try {
      const serverResponse = await getData(url);
      if (serverResponse.status === 200) {
        const { message, estates } = serverResponse.data;
        console.log(message);
        setEstateList(estates);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 404 || status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Peoples Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    }
  };

  const getMembers = async () => {
    const url = "estates/employees/" + user?.userId;

    try {
      const serverResponse = await getData(url);
      if (serverResponse.status === 200) {
        const { message, employees } = serverResponse.data;
        console.log(message);
        setMemberList(employees);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 404 || status === 400) {
        console.log(error.response?.data?.error);
        errMsg = "Invalid user ID";
      }

      console.log("Employees Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    }
  };

  const addMember = async (data: MemberProps) => {
    setLoading(true);

    try {
      const serverResponse = await postData(data, "users");
      if (serverResponse.status === 201) {
        console.log(serverResponse.data.message);
        ToastAlert({
          type: "success",
          title: "Account created successfully",
          onClose: getMembers,
        });
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 401 || status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Peoples Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (id: number, estates: number[]) => {
    console.log("updating");

    const data = { id, estates };

    try {
      const serverResponse = await updateData(data, "estates");
      if (serverResponse.status === 200) {
        console.log(serverResponse.data.message);
        ToastAlert({
          type: "success",
          title: "User updated successfully",
          onClose: getMembers,
        });
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Peoples Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async () => {
    console.log("Delete confirmed: ", deleteUser);

    try {
      const serverResponse = await deleteData({ userId: deleteUser }, "users");
      if (serverResponse.status === 200) {
        console.log(serverResponse.data.message);
        ToastAlert({
          type: "success",
          title: "User deleted successfully",
          onClose: getMembers,
        });
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Peoples Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setDialogOpen(false);
    }
  };

  useEffect(() => {
    getEstateList();
    getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedSearch = searchName.toLowerCase();

  const matchedEstateIds = estateList
    ?.filter((est) => est.estate.toLowerCase().includes(normalizedSearch))
    .map((est) => est.estateId);

  const filteredMembers = memberList?.filter(
    (member) =>
      member.fName.toLowerCase().includes(normalizedSearch) ||
      member.lName.toLowerCase().includes(normalizedSearch) ||
      member.email.toLowerCase().includes(normalizedSearch) ||
      member.estates.some((id) => matchedEstateIds?.includes(id))
  );

  return (
    <Grid container spacing={3} fontFamily={"Montserrat"}>
      {/* Top Section */}
      <Grid
        size={12}
        container
        display={"flex"}
        justifyContent={"space-between"}
        spacing={2}
      >
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <SearchBox
            value={searchName}
            placeholder="Find a member..."
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6, lg: 4 }}
          display={"flex"}
          justifyContent={{ xs: "start", md: "end" }}
        >
          <FillButton
            onClick={handleAdd}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: "5px",
              gap: 1,
            }}
            startIcon={<BsPersonFillAdd />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add new member"
            )}
          </FillButton>
        </Grid>
      </Grid>

      {/* User List */}
      <Grid size={12} container>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ maxHeight: "calc(100vh - 155px)" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    fontFamily: "inherit",
                  }}
                >
                  Member
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    fontFamily: "inherit",
                  }}
                >
                  Estate(s)
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    textAlign: "center",
                  }}
                >
                  Role
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredMembers &&
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={member.img || undefined}
                          alt={`Profile picture of ${member.fName}`}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography
                            sx={{ color: "#262626" }}
                            fontFamily={"Montserrat"}
                            fontSize={"16px"}
                            fontWeight={600}
                          >
                            {member.fName} {member.lName}
                          </Typography>

                          <Typography
                            sx={{ color: "#aaa" }}
                            fontFamily={"Montserrat"}
                            fontSize={"14px"}
                          >
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{ textAlign: "center", fontFamily: "inherit" }}
                    >
                      {member.estates
                        .map(
                          (estateId) =>
                            estateList?.find((est) => est.estateId === estateId)
                              ?.estate
                        )
                        .filter((name) => name !== undefined)
                        .join(", ")}
                    </TableCell>

                    <TableCell
                      sx={{ textAlign: "center", fontFamily: "inherit" }}
                    >
                      {member.role}
                    </TableCell>

                    <TableCell>
                      {!superUsers.includes(member.role.toLowerCase()) && (
                        <Stack
                          direction={"row"}
                          justifyContent={"center"}
                          spacing={1}
                        >
                          <Tooltip title={"Edit user"}>
                            <IconButton
                              onClick={() => handleEdit(member.id)}
                              color="default"
                            >
                              <FaUserEdit />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={"Remove User"}>
                            <IconButton
                              onClick={() => handleDelete(member.id)}
                              color="error"
                            >
                              <ImBin />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <AlertDialog
        open={dialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteMember}
        onCancel={() => setDialogOpen(false)}
      />

      <FormDialog
        open={formOpen}
        estates={estateList}
        initialValues={formData}
        onClose={() => setFormOpen(false)}
        isEditMode={!!formData.id}
        onSubmit={handleSubmit}
      />
    </Grid>
  );
}

export default People;
