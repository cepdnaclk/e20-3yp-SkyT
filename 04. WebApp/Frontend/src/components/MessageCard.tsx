import {
  Badge,
  Card,
  CardContent,
  Stack,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import LetterAvatar from "./LetterAvatar";

interface messageProps {
  msgId: number;
  title: string;
  message: string;
  time: string;
  sender: string;
  isRead: boolean;
}

interface MessageCardProps {
  message: messageProps;
  onClick: (msgId: number) => void;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function MessageCard({ message, onClick }: MessageCardProps) {
  const isMediumUp = useMediaQuery("(min-width:570px)");

  const SENDER_MAX_LEN = isMediumUp ? 20 : 10;
  const TITLE_MAX_LEN = isMediumUp ? 50 : 15;
  const MESSAGE_MAX_LEN = isMediumUp ? 200 : 130;

  return (
    <Card
      elevation={3}
      onClick={() => onClick(message.msgId)}
      sx={{
        width: "calc(100% - 40px)",
        maxWidth: "sm",
        height: "150px",
        padding: "20px",
        fontFamily: "Montserrat",
        cursor: "pointer",
      }}
    >
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"}>
          {message.isRead ? (
            <LetterAvatar
              alt={message.sender}
              text={message.sender}
              style={{ width: 45, height: 45, marginRight: "16px" }}
            />
          ) : (
            <StyledBadge
              sx={{ mr: 2 }}
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <LetterAvatar
                alt={message.sender}
                text={message.sender}
                style={{ width: 45, height: 45, marginRight: "16px" }}
              />
            </StyledBadge>
          )}

          <Stack>
            <Typography variant="h6" fontFamily={"inherit"} fontWeight={580}>
              {message.sender.length > SENDER_MAX_LEN
                ? message.sender.slice(0, SENDER_MAX_LEN) + "..."
                : message.sender}
            </Typography>

            <Typography
              color="text.secondary"
              fontFamily={"inherit"}
              variant="subtitle1"
            >
              {message.title.length > TITLE_MAX_LEN
                ? message.title.slice(0, TITLE_MAX_LEN) + "..."
                : message.title}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {message.time}
        </Typography>
      </Stack>

      <CardContent sx={{ px: 0, textAlign: "justify" }}>
        {message.message.length > MESSAGE_MAX_LEN
          ? message.message.slice(0, MESSAGE_MAX_LEN) + "..."
          : message.message}
      </CardContent>
    </Card>
  );
}

export default MessageCard;
