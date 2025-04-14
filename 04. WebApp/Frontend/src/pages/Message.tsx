import { Grid, Typography } from "@mui/material";
import MessageCard from "../components/MessageCard";
import { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";
import MessageDialog from "../components/MessageDialog";
import AlertDialog from "../components/AlertDialog";

interface messageProps {
  id: string;
  title: string;
  message: string;
  time: string;
  sender: string;
  status: string;
}

const DUMMYMESSAGE: messageProps[] = [
  {
    id: "1",
    title: "Welcome to Our Platform",
    message:
      "We’re thrilled to have you join our community! Explore all the features we offer and get the most out of your experience. If you have any questions or feedback, feel free to reach out to our support team anytime. Enjoy your journey with us!",
    time: "3 Days Ago",
    sender: "System Admin",
    status: "unread",
  },
  {
    id: "2",
    title: "Update Now Available",
    message:
      "A new version of our application is now live. This update includes performance improvements, bug fixes, and a few exciting new features designed to enhance your user experience. Please update at your earliest convenience to take advantage of the latest improvements and ensure smooth operation.",
    time: "1 Days Ago",
    sender: "Update Bot",
    status: "unread",
  },
  {
    id: "3",
    title: "Scheduled Maintenance Alert",
    message:
      "Please be advised that our platform will undergo scheduled maintenance on April 12th from 1:00 AM to 3:00 AM. During this time, access may be limited. We appreciate your patience and understanding as we work to improve system reliability and performance for all users.",
    time: "3 Minuites Ago",
    sender: "Support Team",
    status: "unread",
  },
  {
    id: "4",
    title: "Password Changed Successfully",
    message:
      "You’ve successfully changed your password. If you didn’t initiate this change, please contact our support team immediately to ensure the security of your account. We recommend updating your password regularly and using a strong, unique passphrase to protect your personal information and privacy.",
    time: "Just Now",
    sender: "Security Bot",
    status: "unread",
  },
  {
    id: "5",
    title: "Explore New Features",
    message:
      "We’ve added some exciting new features, including a customizable dashboard and dark mode! Check out the latest updates under your settings and personalize your experience today. We’re constantly working to improve and your feedback helps guide our development process. Let us know what you think!",
    time: "last Week",
    sender: "Product Team",
    status: "unread",
  },
  {
    id: "6",
    title: "Email Verification Reminder",
    message:
      "You haven’t verified your email address yet. Verifying helps secure your account and ensures you receive important notifications. Click the verification link we sent or request a new one from your settings page. It only takes a moment, and it’s a crucial security step.",
    time: "2025-04-10 at 08:10",
    sender: "Account Services",
    status: "read",
  },
  {
    id: "7",
    title: "We Value Your Feedback",
    message:
      "We recently rolled out an update and would love to hear what you think! Your feedback helps us make improvements that truly matter to you. Please take a moment to fill out our quick survey and let us know how we’re doing. Thank you!",
    time: "2025-04-10 at 11:30",
    sender: "Customer Experience",
    status: "read",
  },
  {
    id: "8",
    title: "Subscription Expiring Soon",
    message:
      "Your current subscription will expire in three days. Renew now to maintain uninterrupted access to premium features and support. Visit your account settings to view available renewal options. Don’t miss out—renew today to continue enjoying all the benefits of your current plan.",
    time: "2025-04-10 at 13:50",
    sender: "Billing Team",
    status: "read",
  },
  {
    id: "9",
    title: "Security Alert: Login Detected",
    message:
      "We noticed a login to your account from a new device or location. If this was you, no action is required. If you don’t recognize this activity, please secure your account immediately by changing your password and reviewing your recent login history in settings.",
    time: "2025-04-10 at 21:40",
    sender: "Security Monitor",
    status: "read",
  },
  {
    id: "10",
    title: "You’ve Earned a Bonus!",
    message:
      "Congratulations! You've unlocked a new reward for your continued use of our platform. Visit your rewards section to see what’s available and claim your bonus today. Thanks for being a valued member of our community—we appreciate your loyalty and engagement every single day.",
    time: "2025-04-10 at 07:25",
    sender: "Rewards Team",
    status: "read",
  },
];

function Message() {
  const [messages, setMessages] = useState<messageProps[]>(DUMMYMESSAGE);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [searchName, setSearchName] = useState<string>("");
  const [messageData, setMessageData] = useState<messageProps>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const filteredMessages = messages?.filter(
    (message) =>
      message.sender.toLowerCase().includes(searchName.toLowerCase()) ||
      message.title.toLowerCase().includes(searchName.toLowerCase())
  );

  const handleClick = (msgId: string) => {
    console.log("Reading Message: ", msgId);

    // Find the message
    const msg = messages?.find((message) => message.id === msgId);

    if (msg) {
      // Update the message status to 'read'
      const updatedMessages = messages.map((message) =>
        message.id === msgId ? { ...message, status: "read" } : message
      );

      setMessages(updatedMessages);
      setMessageData({ ...msg, status: "read" });
      setOpenDialog(true);
      updateState(msg.id);
    }
  };

  const handleDelete = () => {
    console.log("Message will be deleted!", messageData);
    setOpenDelete(false);
    setOpenDialog(false);
    deleteMessage();
  };

  const deleteMessage = async () => {
    console.log("Deleted");
  };

  const updateState = async (messageId: string) => {
    console.log("Mark as read", messageId);
  };

  useEffect(() => {
    console.log("geting info");
  }, []);

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
        {filteredMessages?.map((message) => (
          <Grid
            size={12}
            key={message.id}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
            <MessageCard message={message} onClick={handleClick} />
          </Grid>
        ))}
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
        onConfirm={handleDelete}
        onCancel={() => setOpenDelete(false)}
      />
    </Grid>
  );
}

export default Message;
