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

interface MemberProps {
  id: string;
  fname: string;
  lname: string;
  email: string;
  img: string | null;
  role: string;
  estates: string[];
}

const members: MemberProps[] = [
  {
    id: "1",
    fname: "Frasco",
    lname: "Soda",
    email: "fsoda0@hc360.com",
    img: "http://dummyimage.com/140x100.png/5fa2dd/ffffff",
    role: "Owner",
    estates: ["Zoonder"],
  },
  {
    id: "2",
    fname: "Brynne",
    lname: "Aseef",
    email: "baseef1@google.co.uk",
    img: "http://dummyimage.com/108x100.png/dddddd/000000",
    role: "Maintain",
    estates: ["Zoonder"],
  },
  {
    id: "3",
    fname: "Jorrie",
    lname: "Rielly",
    email: "jrielly2@github.com",
    img: "http://dummyimage.com/101x100.png/5fa2dd/ffffff",
    role: "Owner",
    estates: ["Devcast"],
  },
  {
    id: "4",
    fname: "Barnard",
    lname: "Gudge",
    email: "bgudge3@over-blog.com",
    img: "http://dummyimage.com/117x100.png/cc0000/ffffff",
    role: "Admin",
    estates: ["Jabberstorm"],
  },
  {
    id: "5",
    fname: "Antonetta",
    lname: "Edler",
    email: "aedler4@vinaora.com",
    img: "http://dummyimage.com/237x100.png/5fa2dd/ffffff",
    role: "Owner",
    estates: ["Zoonder"],
  },
];

const estates: string[] = [
  "estate",
  "Aimbu",
  "Riffpath",
  "Devcast",
  "Jabberstorm",
  "Zoonder",
];

const newMember: MemberProps = {
  id: "",
  fname: "",
  lname: "",
  email: "",
  img: null,
  role: "Maintain",
  estates: [],
};

function People() {
  const [memberList, setMemberList] = useState<MemberProps[]>();
  const [estateList, setEstateList] = useState<string[]>();
  const [searchName, setSearchName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<MemberProps>(newMember);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleteUser, setDeleteUser] = useState<string>("");

  const handleEdit = (userId: string) => {
    const user = memberList?.filter((usr) => usr.id === userId);
    console.log("User: ", user);

    if (!!user && user.length > 0) {
      setFormData(user[0]);
      setFormOpen(true);
    }
  };

  const handleDelete = (userId: string) => {
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
    if (values.id) {
      console.log("Update User: ", values);
      updateMember();
    } else {
      console.log("Add User: ", values);
      addMember();
    }

    setFormOpen(false);
  };

  const deleteMember = () => {
    console.log("Delete confirmed: ", deleteUser);
    setDialogOpen(false);
  };

  const getMembers = () => {
    setLoading(true);

    try {
      setMemberList(members);
      setEstateList(estates);
    } catch (err) {
      console.log("Error while fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMember = () => {
    console.log("updating");
  };

  const addMember = () => {
    console.log("Add member");
  };

  useEffect(() => {
    getMembers();
  }, []);

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
              {memberList &&
                memberList.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={member.img || undefined}
                          alt={`Profile picture of ${member.fname}`}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography
                            sx={{ color: "#262626" }}
                            fontFamily={"Montserrat"}
                            fontSize={"16px"}
                            fontWeight={600}
                          >
                            {member.fname} {member.lname}
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
                      {member.estates}
                    </TableCell>

                    <TableCell
                      sx={{ textAlign: "center", fontFamily: "inherit" }}
                    >
                      {member.role}
                    </TableCell>

                    <TableCell>
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
