import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";

import AppsIcon from "@mui/icons-material/Apps";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import ModeSelect from "~/components/ModeSelect";
import { ReactComponent as TrelloLogo } from "~/assets/trello.svg";
import Workspaces from "./Menus/Workspaces";
import Recent from "./Menus/Recent";
import Starred from "./Menus/Starred";
import Templates from "./Menus/Templates";
import Contact from "./Menus/Contact";
import Profiles from "./Menus/Profiles";
function AppBar() {
  return (
    <Box
      px={2}
      sx={{
        backgroundColor: "primary",
        width: "100%",
        height: (theme) => {
          theme.trello.appBarHeight;
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        overflowX: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AppsIcon
          sx={{
            color: "primary.main",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <SvgIcon
            component={TrelloLogo}
            inheritViewBox
            fontSize="small"
            sx={{
              color: "primary",
            }}
          />
          <Typography
            variant="span"
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Trello
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex", gap: 1 },
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Contact />
          <Button variant="outlined" startIcon={<LibraryAddIcon />}>
            Create
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          id="outlined-search"
          label="Search..."
          type="search"
          size="small"
          sx={{ maxWidth: "120px" }}
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="secondary" variant="dot" sx={{ cursor: "pointer" }}>
            <NotificationsNoneIcon
              sx={{
                color: "primary.main",
              }}
            />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: "pointer", color: "primary.main" }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
