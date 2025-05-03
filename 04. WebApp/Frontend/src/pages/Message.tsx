import { Grid, Typography } from "@mui/material";
import MessageCard from "../components/MessageCard";
import { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import MessageDialog from "../components/MessageDialog";
import AlertDialog from "../components/AlertDialog";
import { useAuth } from "../context/AuthContext";
import { deleteData, getData, updateData } from "../api/NodeBackend";
import { ToastAlert } from "../components/ToastAlert";

interface messageProps {
  msgId: number;
  title: string;
  message: string;
  time: string;
  sender: string;
  isRead: boolean;
}

function Message() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<messageProps[]>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [messageData, setMessageData] = useState<messageProps>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const filteredMessages = messages?.filter(
    (message) =>
      message.sender.toLowerCase().includes(searchName.toLowerCase()) ||
      message.title.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleClick = (msgId: number) => {
    console.log("Reading Message: ", msgId);

    // Find the message
    const msg = messages?.find((message) => message.msgId === msgId);

    if (msg) {
      setMessageData({ ...msg, isRead: true });
      setOpenDialog(true);
      updateState(msg.msgId);
    }
  };

  const deleteMessage = async () => {
    console.log("Deleted");

    const data = { msgId: messageData?.msgId, userId: user?.userId };

    try {
      const serverResponse = await deleteData(data, "notify");
      if (serverResponse.status === 200) {
        ToastAlert({
          type: "success",
          title: "Message deleted successfully.",
          onClose: getMessages,
        });
      }
    } catch (err) {
      console.log("Message Error:", err);
      ToastAlert({
        type: "error",
        title: "Failed to delete message!",
      });
    } finally {
      setOpenDelete(false);
      setOpenDialog(false);
    }
  };

  const updateState = async (msgId: number) => {
    console.log("Mark as read", msgId);
    const data = { msgId, userId: user?.userId };

    try {
      const serverResponse = await updateData(data, "notify");

      if (serverResponse.status === 201) {
        console.log(serverResponse.data);
      }
    } catch (err) {
      console.log("Message Error:", err);
      ToastAlert({
        type: "error",
        title: "Failed to update message status!",
      });
    } finally {
      getMessages();
    }
  };

  const getMessages = async () => {
    console.log("geting info");
    const url = `notify/${user?.userId}`;

    try {
      const serverResponse = await getData(url);

      if (serverResponse.status === 200) {
        const { message, notifications } = serverResponse.data;
        console.log(message, notifications);
        setMessages(notifications);
      }
    } catch (err) {
      console.log("Message Error:", err);
      ToastAlert({
        type: "error",
        title: "Failed to find messages!",
      });
    }
  };

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography
          fontFamily={"Montserrat"}
          fontSize={"30px"}
          fontWeight={600}
          noWrap
        >
          All Notifications
        </Typography>
      </Grid>

      <Grid
        size={{ xs: 12, sm: 6 }}
        display={"flex"}
        justifyContent={{ xs: "start", sm: "end" }}
      >
        <SearchBox
          value={searchName}
          placeholder="Search"
          onChange={(e) => setSearchName(e.target.value)}
        />
      </Grid>

      <Grid
        size={12}
        maxHeight={"calc(100vh - 150px)"}
        overflow={"auto"}
        container
        py={"10px"}
      >
        {filteredMessages ? (
          filteredMessages.map((message) => (
            <Grid
              size={12}
              key={message.msgId}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <MessageCard message={message} onClick={handleClick} />
            </Grid>
          ))
        ) : (
          <Typography
            textAlign={"center"}
            width={"100%"}
            fontFamily={"Montserrat"}
            fontWeight={500}
          >
            No notifications to show. Enjoy your day!
          </Typography>
        )}
      </Grid>

      {messageData && (
        <MessageDialog
          open={openDialog}
          message={messageData}
          handleClose={() => setOpenDialog(false)}
          handleDelete={() => setOpenDelete(true)}
        />
      )}

      <AlertDialog
        open={openDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteMessage}
        onCancel={() => setOpenDelete(false)}
      />
    </Grid>
  );
}

export default Message;
