import {
  Badge,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconMenu from "../components/IconMenu";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox";

interface estateProps {
  id: string;
  estate: string;
  address: string;
  image: string;
}

interface estateCardProps {
  estate: estateProps;
}

const USER = "John";

const ESTATES: estateProps[] = [
  {
    id: "1",
    estate: "Ferry, Klein and Wuckert",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKESURBVDjLfZNLSFRRGIC/O3Pn1cyUlLXIlB6SQrXo/YSiRSQDualVUFZE1KJtrTKHIloEbQpqYUW4DipSehBIYWr00MIs0ckUR6Z8jqNz7/nPaTEqI2E/HM6D833n5/znWMYYZuLglUZz4lApTT+H0MogohHRaNEopdmzZgm36z7w/vZha4axyQstgtYG5U6DKteLyjWlDKIkH8GTP5k9zRWUI6xzP3PKuYvrCK4rOeH/BFoJExmX5dEAriMcMK/YER6gaKqb4kUh0pksIv/NQOKt7YMUBmzWRydYa36gl+8mZjWxLOyn+WMfWkl8XkHj9YrqL99T8ea2JLtohTWVSOFWNjlNtHz6SXtnMt5RV1Wdz1jGGHi4O4THW4bBC3ChM3bm/Op3pws3H0dcm8CvRzz8oJ9UlSZqyG0BNZXi5JvenODBtj4WlxcZLDAGjEaW7SRrr0Cnf+NVIwQyP7CmhnJJiwvpATxjw8dygmvFh1CmTu87G5HSI+ixFGrsN3o8hc6MYJwsGI3lX4AXhd3+lGBP12PCvqPW7EO6VFSK5qneXlmWLalEhpNIZhidGcVMjGEsQ0ANEfn4Ukirau4lr869xHh/FxHfFs+3hkf2yFeMdjBTE5hsBq0msX02kY7XQzimYgb+pwpcTKQpWPjCM57AKBeUC1rAne79dpo7/S/mLSMA3mBMCspzQ58i6B3FEypAdABZvLSEmvIN8wtqd4Qw1n6JrCTYXU/0eW3Xgrf196OpZgLecdTCVSBWbH6B6L0SXhHyPbuMv6XlLsps5FbfCd9Ab0X407N+MzkJrpkjmPMbGR0p8n5P9vDHOUftYMPs+o1EAxfL1gU7224ibMtH/gIKIWcO8vV/HwAAAABJRU5ErkJggg==",
    address: "8770 TESORO DRIVE",
  },
  {
    id: "2",
    estate: "Rogahn-Schneider",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKiSURBVDjLfVNdSFNhGH7Oz7Q5N3dshrKRGP4wFElMKALL7McIDDIKopuIorsuIqLLuopdxKSbIqmroKIuVCjtIoQk03BtF7FYyCxIUMmpyXQ7O+frfb9Nxai+8X7vztn3Ps/zvc87RQiB/61IJPI4l8udN01TpwzKMrLZLOenyr8AYrFYGRX0eb3e08XFJchQEWwb8jTVGIYXw8Ovof+tOBqNdnGxz+fzu1wuJKd/gNltW8AWNgEJWASWyWSgx+PxjGVZRRTy0LpMzqlU6k/JWFhIEZCNI0ePy3c6FwcCO7G4uCTZBX8EqxQy+IE4UW6UYXCgH41NLZKdf5MKGJWLb/RF6JgCRaE9v8nM8Wt5GaHLbZLxU+QDWG3ViZN5BSyVWfmgUb4dqqpCoVALwd9rSxNwzD0ErAo0NbdBUA9EoQcqK6BnAlChadqWUCmcDgtdu+Iwqvag2vMd8+4kHi2G5bWkArNgj6Iq0HR9g11mUtXsHkNdsB2eqhb4nc/w/GsM35bWpAoJwBs3hK/AjDU7SuT9eZViHkExCrfvHKzlAQRaLuDK5CvMVndTjS1dkQDMyI3imErkZ0GhvpypHUOg8xSwFsHEk37svXQTRStfUIwGAvBvKnA4dNy5uFvaY5o5pNNkz2oClaoHbiNN7Emy04a18hE1B68h/eY+RG5fXgF18u7IyNsD64NCudzjdtXUiSF428/CTo9T7SpaexpgZ2ewzZVAIHgYKz/fyWHb8l/o7e29SiDd++uVQ35DRWW9k1gnSG4Wky/jBBKEopUBzmMYfXALQzO1yQ2AcDhcQdbNdXR0Yu39dTT23IOmTpPUlJzPzUV2Oxsw+zmKxODtFxsAoVBII/njpKC1wzUM1TKlVTz4ishleHDWB6jwnt2b/A3aCqjQmVNP6QAAAABJRU5ErkJggg==",
    address: "Credit Union House, Main Street, Ballybay",
  },
  {
    id: "3",
    estate: "Johns Group",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ6SURBVDjLjZM7aJNhFIaf77/k/9OkJpBWjSWtaUEREVEXL6uoiIOLULCigyi4VRy8gHQo4uIsuIhOOuigCJKCLWpx8kLRQqFWhV4SQ1PTNGn+5Ls4RGlrq/jyLd9wHs57znvEvafvbmktTlZq2g8kq2VWfl0HfJe7Z4/v7gVwtBE9xw6kWn3fF0LY/EtVDUrWefxi/AzQAFQC7XmeL+4PzVFllpIYI73hO2G3iDSawnyYT+Mxmsw2HBJcOpFGaSF+Q52aBMuysQTUrCzplu94oW8UgxJSSRzPozOV5MtEhHioBa1XduUAaMCyBIHJE3Ln+LFYJFBValIiTRnP8ygHYRJhC4NZMZglgBAYqQlUnaoMWKwH1LREaUDUMVrhWAJjVk7VAjCmAfBppVSOYHAJtCKQCiFClEtRoqFN2LYFRqy2YEzDQtRuYyqbI+bP0BSx8IRkodBELpskGevEscSqzThmOcBdz6bwLibfDxKPTiOUwq220t7VQ9RPorT+MxZLHYzNnkNpjdKaLUGefakONDAxk+P5whW2f5xj6/gko7fnSTcnmjN38pcPZeRNxxiDAI40ggWAveMHlfIs/swILfvP0TOcYV39DVtOX8VLb2dxJGONvhroHzjolh2xRl5VOI4KxwlauhoJzDxgz6le/M9D8LKfpliczR0ddmHM9Dq+K4roemznhr0gxC+U+f0AeJvP4W9Mw9GLS977kthabHZCjnj4aHBiX02ZHcasfQOd0URz5cMzK/LkAsFilgpQmrdRNtPC/K1qmV53t/WFmiPXUgnpONYkpbzka85W9aq5/l8AgOHu9svlwvR5W4kOZZspA7cPZ+SNn/95GW/b/Tx4AAAAAElFTkSuQmCC",
    address: "Tenter Weg 1-3",
  },
  {
    id: "4",
    estate: "Nader LLC",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFYSURBVDjLY/z//z8DJYCJgUJAsQEsuCQeHIgP/f/vX/H/f//9lFyWvCLJBff2xPD9+/27kV/O3xxIl5HsBaCmAj5Zb00+SUOGPz9/J19fF2BKtAG3NoVoATXl84oIMPz9tIlBXC9F4O/PX7WXl3iwEjQAaBPTn5+/KkW1ooUYfpxjOLVoKQOPwHeGPz9++QCxH0EDgDa5cQnrxfAKfmP49/M+A8P/fwx/v5xmUHQoZvzz82fzqUmWvDgNuLjQjQ1oS4uAnAHDv2+XgHq/MxgHqzP8+/WMgYPjFoO4boQm0HWFOA0A2p4qpOJtzMX7huH/n7cMDIzMDGfX3QIFKcO/H7cYRNXkgWp+Zx9q0tHCmg7+/PgJ9Ls/0MgHDEx8okCR/wxmSQFwe5g5lRmUXMvFbm1uagQKhGIa8PMXx7nZwd+BCQfo/H9I+D+cZgDR//9LILuAcehnJgBMs6gZ4tipDAAAAABJRU5ErkJggg==",
    address: "PIAZZA FILIPPO MEDA 4",
  },
  {
    id: "5",
    estate: "Renner-Beer",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJNSURBVDjLpZNLSNVhEMV/f7UCy+iaqWkpKVFqUIlRUS3SHkSPRYugVbuCaFPrEgIxsKCFix5QtIsWraIIS5MQa6G1CTN7iKa3SAyt7P7v983M1+Kqm4oCB4bDmcXhzBkmCiEwl8pijpXTf+v0iKqWmimqgqpHxCPiZtF7h4hrO9DUufc3AVUtLdy2jxCUoEYwwUwJKgT1mApBhRf3bu75owMRj5mQnkwSVDDxmPoMisPEsWDxcq7ltXDl/JOgoqioipeTXZf2X88RcRRVH/znrtrZQePRWtQCI2M/slvv9l4AMgLn7n+gP/kddYY4RZ0iaZ3la0sWIl5wEqgpT7BxVYLLt5/nA+R4n+bEsi5+Zg1NW/botPUZnru0nNb8du70THFs3gNqyorxzmfO6H0a8w51KWS61aVQF6MuxnyMiScWx4qCKlo7d9LzbnRWIMe5GBXH/LyiTOKSSf7qtzZCtseZ4Cb6Kc1fTVXxZr7HU1zs2ITqWQCiI7s2hBAMMyMEI0xj6fEEu2uOocFQU4zA58kREgsLefbhMb1DT4k1vSTrzqOX0aukH0xUbqFkXT39Y1GqvHYfsTg0GEPjbxkcH+D9WB8TqXGGvr5nw8odrCmpI5YwHoUQqK6u3g60ACngBnCq9gxbD60/gZgipmgwPk0Ok7+omJcfu3n0+uFXpzREf3umw1crLHYOZ45YHJUFNdGWij30DHfTPtD22QkNyebQF/3vN65rypqqK6vP7RxoH3VGQ7I5vAH4b4GKxmhKLTs3ZVrxpTkMzsx/ARtuob3+yA7oAAAAAElFTkSuQmCC",
    address: "2ND FLOOR",
  },
];

function EstateCard({ estate }: estateCardProps) {
  return (
    <Grid
      size={{ xs: 12, md: 6, lg: 4 }}
      display={"flex"}
      justifyContent={"center"}
    >
      <Card
        component={NavLink}
        to={`/estate/${estate.id}`}
        elevation={3}
        sx={{ width: 345, cursor: "pointer", textDecoration: "none" }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={estate.image}
            alt={estate.estate}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {estate.estate}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {estate.address}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

function Dashboard() {
  const navigator = useNavigate();
  const [user, setUser] = useState<string>();
  const [estates, setEstates] = useState<estateProps[]>();
  const [msgCount, setMsgCount] = useState<number>();
  const [search, setSearch] = useState<string>("");

  const filteredEstates = estates?.filter(
    (est) =>
      est.estate.toLowerCase().includes(search.toLowerCase()) ||
      est.address.toLowerCase().includes(search.toLowerCase())
  );

  const getInfo = async () => {
    setEstates(ESTATES);
    setMsgCount(10);
    setUser(USER);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Grid container spacing={3} fontFamily={"Montserrat"}>
      {/* Welcome Message */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography fontWeight={700} fontFamily={"inherit"} variant="h5" noWrap>
          Welcome {user}
        </Typography>
      </Grid>

      {/* Quick Links */}
      <Grid size={{ xs: 12, md: 6 }} display={"flex"} justifyContent={"end"}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={{ xs: "start", md: "end" }}
          width={"100%"}
        >
          <SearchBox
            placeholder="Search"
            value={search}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />

          <Stack direction={"row"} display={{ xs: "none", md: "flex" }}>
            <Tooltip title={"Notifications"} sx={{ ml: 2 }}>
              <IconButton
                onClick={() => {
                  navigator("/notifications");
                }}
              >
                <Badge badgeContent={msgCount} color="primary" max={9}>
                  <NotificationsIcon color="action" sx={{ fontSize: 30 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconMenu />
          </Stack>
        </Stack>
      </Grid>

      {/* Body Section */}
      <Grid
        size={12}
        container
        maxHeight={"calc(100vh - 185px)"}
        overflow={"auto"}
        padding={"10px"}
      >
        {filteredEstates?.map((estate) => (
          <EstateCard key={estate.id} estate={estate} />
        ))}
      </Grid>
    </Grid>
  );
}

export default Dashboard;
